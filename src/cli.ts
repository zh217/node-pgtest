import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import chalk from 'chalk';
import {PgTapRunner} from "./pgtap_runner";
import {getAllTestFiles} from "./test_discovery";
import {FileWatcher} from "./file_watcher";


const argv = yargs
    .describe('config', 'config file to use')
    .alias('c', 'config')
    .default('c', './pgtest_config.json')
    .describe('watch', 'Watch directory for changes')
    .boolean('w')
    .alias('w', 'watch')
    .default('w', false)
    .describe('init', 'Run init script only and then stop')
    .alias('i', 'init')
    .boolean('init')
    .default('init', false)
    .describe('nuke', 'Run nuke script only and then stop')
    .alias('x', 'nuke')
    .boolean('nuke')
    .default('nuke', false)
    .describe('bare', 'Skip init/nuke; run the tests only')
    .alias('b', 'bare')
    .default('b', false)
    .boolean('stopOnError')
    .alias('s', 'noStopOnError')
    .describe('s', 'Do not stop on first error encountered')
    .default('s', false)
    .argv;

const cwd = process.cwd();

function makeAbsolutePath(filePath: string, rootDir?: string) {
    if (path.isAbsolute(filePath)) {
        return path.normalize(filePath);
    }
    if (!rootDir) {
        return path.normalize(path.join(cwd, filePath));
    }

    if (path.isAbsolute(rootDir)) {
        return path.normalize(path.join(rootDir, filePath));
    }

    return path.normalize(path.join(cwd, rootDir, filePath));
}

const defaultConfig = require('../pgtest_config.json');
const userConfigPath = makeAbsolutePath(argv.config);
let userConfig;
try {
    userConfig = JSON.parse(fs.readFileSync(userConfigPath).toString())
} catch (e) {
    console.error(chalk`Requested config file {bold.red ${userConfigPath}} does not exist!`);
    process.exit(1);
}

const combinedConfig = {...defaultConfig, ...userConfig};

console.log(chalk`{white > TESTING postgresql database with config {bold ${userConfigPath}}}`);

const basePath = path.join(path.dirname(userConfigPath), combinedConfig.directory);

async function run() {
    const tests = await getAllTestFiles(basePath, combinedConfig.testDiscoveryGlob);
    // console.log(`> PREPARE to run ${tests.length} tests`);
    const runner = new PgTapRunner({
        initScript: makeAbsolutePath(combinedConfig.initScript, basePath),
        nukeScript: makeAbsolutePath(combinedConfig.nukeScript, basePath),
        testScript: makeAbsolutePath(combinedConfig.testScript, basePath),
        stopOnError: !argv.s,
        initOnly: argv.init,
        nukeOnly: argv.nuke,
        tests: tests,
        bareRun: argv.bare
    }, {
        psqlExecutable: combinedConfig.psqlExecutable,
        uri: combinedConfig.connectionUri,
        timeout: combinedConfig.testTimeout
    });
    await runner.start();
}

if (!argv.w) {
    run().then(() => {
        process.exit(0);
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
} else {
    let running = false;
    let dirty = false;
    const watcher = new FileWatcher(basePath, /\.sql$/i);
    const doRun = () => {
        const changed = [...watcher.flush()];
        if (changed.length) {
            console.log();
            console.log(`> FILES changed: ${changed}`);
        }
        running = true;
        run().then(() => {
            if (dirty) {
                dirty = false;
                doRun();
            } else {
                running = false;
            }
        });
    };
    watcher.on('changed', () => {
        if (running) {
            dirty = true;
        } else {
            dirty = false;
            doRun();
        }
    });
    doRun();
}
