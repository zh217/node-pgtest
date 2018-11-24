import tapOut from 'tap-out';
import {Readable, Stream} from "stream";
import WritableStream = NodeJS.WritableStream;
import chalk from 'chalk';

export class TapReporter {
    tap: WritableStream;
    result: Promise<boolean>;
    startAt: number;

    constructor(outStream: Stream) {
        this.startAt = Date.now();
        this.tap = tapOut();
        outStream.pipe(this.tap);
        this.setupTap();
        this.result = new Promise((resolve, reject) => {
            this.tap.on('output', (res) => {
                const timeTaken = Date.now() - this.startAt;
                // process.stdout.write('  ');
                // let totalToTest = 0;
                // for (const plan of res.plans) {
                //     totalToTest += plan.to - plan.from + 1;
                // }
                // let totalOutput;
                // if (res.fail.length + res.pass.length === totalToTest) {
                //     totalOutput = '' + totalToTest;
                // } else {
                //     totalOutput = chalk.bold.red('' + totalToTest);
                // }
                process.stdout.write( ` in ${timeTaken}ms\n`);
                const ok = !(res.fail.length || res.errors.length);
                // for (const assert of res.asserts) {
                //     if (!assert.ok) {
                //         console.log(chalk`{red FAILED {bold #${assert.number} ${assert.name || ''}}}`);
                //         console.log(assert.error);
                //     }
                // }
                for (const test of res.tests) {
                    const raw = test.raw.slice(2);
                    if (raw.startsWith('Looks like you failed')) {
                        continue;

                    }
                    if (raw[0] !== ' ') {
                        console.log(chalk`{bold.red ${raw}}`);
                    } else {
                        console.log(chalk`{red ${raw}}`);
                    }
                }

                // for (const error of res.errors) {
                //     console.log(chalk`{red ERROR: {bold ${error.message}}}`);
                // }
                // console.log(res);
                if (!ok) {
                    console.log();
                }
                resolve(ok);
            })
        })
    }

    private setupTap() {
        // this.tap.on('test', test => console.log('test', test));
        // this.tap.on('assert', assert => console.log('assert', assert));
        this.tap.on('pass', () => process.stdout.write(chalk`{green .}`));
        this.tap.on('fail', () => process.stdout.write(chalk`{bold.red F}`));
        this.tap.on('error', () => process.stdout.write(chalk`{bold.red E}`));
        // this.tap.on('comment', comment => console.log('comment', comment));
    }

    reportStage(stage: string, path: string | string[]) {
        console.log('STAGE', stage, path);
    }

    reportOut(outData: string[]) {
        console.log('OUT', outData);
    }

    reportErr(errData: string[]) {
        console.log('ERR', errData);
    }

    async reportTap(outData: string[], errData: string[], exitOk: boolean, exitCode: number | null, exitSignal: string | null) {
        const tapResult = await this.getTapResult(outData);
        console.log(tapResult);
    }

    private getTapResult(outData: string[]) {
        return new Promise((resolve, reject) => {
            const outStream = tapOut((output: any, whatever: any) => {
                console.log(output, whatever);
                resolve(output);
            });
            const readable = new Readable();
            readable.pipe(outStream);
            for (const chunk of outData) {
                readable.push(chunk);
            }
            readable.push(null);
        });
    }
}
