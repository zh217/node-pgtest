import {PgTapRunner} from "./pgtap_runner";
import {getAllTestFiles} from "./test_discovery";
import path from 'path';

function withBasePath(file: string) {
    return path.normalize(path.join(__dirname, '..', 'test_db', file));
}

test('runner running', async () => {
    const tests = await getAllTestFiles(path.join(__dirname, '..', 'test_db/'), '**/*.test.sql');
    const tapRunnerConfig = {
        initScript: withBasePath('__init__.sql'),
        nukeScript: withBasePath('__nuke__.sql'),
        testScript: withBasePath('__test__.sql'),
        tests: tests,
        initOnly: false,
        nukeOnly: false,
        bareRun: false,
        stopOnError: true
    };

    const runnerConfig = {
        psqlExecutable: 'psql',
        uri: 'postgres://postgres:ubdugus@127.0.0.1/phs',
        timeout: 10000
    };

    const tapRunner = new PgTapRunner(tapRunnerConfig, runnerConfig);
    await tapRunner.start();
});


