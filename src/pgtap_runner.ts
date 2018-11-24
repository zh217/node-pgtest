import {PSqlRunner, PSqlRunnerConfig} from "./psql_runner";
import {TapReporter} from "./tap_reporter";
import path from 'path';
import chalk from 'chalk'

export interface PgTapRunnerConfig {
    initScript: string,
    nukeScript: string,
    testScript: string,
    tests: string[],
    initOnly: boolean,
    nukeOnly: boolean,
    bareRun: boolean,
    stopOnError: boolean
}

const INIT_PREAMBLE = path.normalize(path.join(__dirname, '..', 'resource', 'init_preamble.sql'));
const TEST_SETUP = path.normalize(path.join(__dirname, '..', 'resource', 'test_setup.sql'));
const TEST_PREAMBLE = path.normalize(path.join(__dirname, '..', 'resource', 'test_preamble.sql'));

export class PgTapRunner {
    readonly onlyMode: boolean;

    constructor(readonly config: PgTapRunnerConfig, readonly runnerConfig: PSqlRunnerConfig) {
        this.onlyMode = config.initOnly || config.nukeOnly;
    }

    async start() {
        console.log();
        const startAt = Date.now();
        try {
            if (!this.config.bareRun) {
                await this.prepare();
            }
            if (!this.onlyMode) {
                await this.runTests();
            }
            // console.log();
            console.log(`> DONE in ${'' + (Date.now() - startAt)}ms`);
            // console.log();
        } catch (e) {
            // console.error(e);
            // console.log();
            console.log(chalk`> {red FAILED} in ${'' + (Date.now() - startAt)}ms`)
            // console.log();
        }
    }

    async prepare() {
        await this.runNuke();
        await this.runInit();
        await this.runTestInit();
    }

    private async runNuke() {
        if (this.config.bareRun || (this.onlyMode && this.config.nukeOnly)) {
            return;
        }
        const startAt = Date.now();
        process.stdout.write(chalk`{white > NUKE with {bold ${this.config.nukeScript}}}`);
        const runner = new PSqlRunner(this.runnerConfig, ['-f', INIT_PREAMBLE, '-f', this.config.nukeScript], false);
        await runner.joinRunner();
        console.log(` in ${Date.now() - startAt}ms`);
        if (runner.stderrData.length) {
            console.log(chalk`{red ${runner.stderrData.join('')}}`);
        }

        if (!runner.exitOk) {
            throw Error('runNuke encountered problems');
        }
    }

    private async runInit() {
        if (this.config.bareRun || (this.onlyMode && this.config.initOnly)) {
            return;
        }
        const startAt = Date.now();
        process.stdout.write(chalk`{white > INIT with {bold ${this.config.initScript}}}`);
        const runner = new PSqlRunner(this.runnerConfig, ['-f', INIT_PREAMBLE, '-f', this.config.initScript]);
        await runner.joinRunner();
        console.log(` in ${Date.now() - startAt}ms`);
        if (runner.stderrData.length) {
            console.log(chalk`{red ${runner.stderrData.join('')}}`);
        }

        if (!runner.exitOk) {
            throw Error('runInit encountered problems');
        }
    }

    private async runTestInit() {
        if (this.config.bareRun || this.onlyMode) {
            return;
        }
        const startAt = Date.now();
        process.stdout.write(chalk`{white > TEST-INIT with {bold ${this.config.testScript}}}`);
        const runner = new PSqlRunner(this.runnerConfig,
            ['-f', INIT_PREAMBLE, '-f', TEST_SETUP, '-f', this.config.testScript]);
        await runner.joinRunner();
        console.log(` in ${Date.now() - startAt}ms`);
        if (runner.stderrData.length) {
            console.log(chalk`{red ${runner.stderrData.join('')}}`);
        }
        if (!runner.exitOk) {
            throw Error('runTest encountered problems');
        }
    }

    private async runTests() {
        if (this.onlyMode) {
            return;
        }
        for (const test of this.config.tests) {
            await this.runTest(test);
        }
    }

    private async runTest(test: string) {
        // console.log();
        process.stdout.write(chalk`{white > TEST {bold ${test}}} `);
        const runner = new PSqlRunner(this.runnerConfig,
            ['-f', TEST_PREAMBLE, '-f', test]);
        const reporter = new TapReporter(runner.stdout);
        await runner.joinRunner();
        const result = await reporter.result;
        if (runner.stderrData.length) {
            console.log(chalk`{red ${runner.stderrData.join('')}}`);
        }
        if ((!result || runner.stderrData.length) && this.config.stopOnError) {
            console.log(chalk`{white > STOP on failure in {bold.red ${test}}}`);
            throw Error('Encountered problem on running script');
        }
    }
}

