import tapOut from 'tap-out';
import {Stream} from "stream";
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
        this.result = new Promise((resolve) => {
            this.tap.on('output', (res) => {
                const timeTaken = Date.now() - this.startAt;
                process.stdout.write(chalk`{gray  in {blue ${'' + timeTaken}}ms}\n`);
                const ok = !(res.fail.length || res.errors.length);

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

                if (!ok) {
                    console.log();
                }
                resolve(ok);
            })
        })
    }

    private setupTap() {
        this.tap.on('pass', () => process.stdout.write(chalk`{green .}`));
        this.tap.on('fail', () => process.stdout.write(chalk`{bold.red F}`));
        this.tap.on('error', () => process.stdout.write(chalk`{bold.red E}`));
    }
}
