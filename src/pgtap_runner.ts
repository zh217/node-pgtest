import {PSqlRunner} from "./psql_runner";
import {TapReporter} from "./tap_reporter";

export interface PgTapRunnerConfig {
    initFile: string,
    nukeFile: string,
    testFiles: [string],
    initOnly: boolean,
    nukeOnly: boolean,
    bareRun: boolean
}

export class PgTapRunner {
    constructor(readonly config: PgTapRunnerConfig, readonly runner: PSqlRunner, readonly reporter: TapReporter) {
        this.start().catch(err => {
            console.error('PgTapRunner has encountered an error');
            console.error(err);
        });
    }

    async start() {
        if (!this.config.bareRun) {
            await this.prepare();
        }
        if (!this.config.initOnly || !this.config.nukeOnly) {
            await this.run();
        }
    }

    async prepare() {

    }

    async run() {

    }
}