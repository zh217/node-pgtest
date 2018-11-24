import {ChildProcess, spawn} from 'child_process';
import {EventEmitter} from "events";

export interface PSqlRunnerConfig {
    psqlExecutable: string
    uri: string
    timeout: number
}

export class PSqlRunner extends EventEmitter {
    readonly process: ChildProcess;
    exited = false;
    exitCode: number | null = null;
    exitSignal: string | null = null;
    stdoutData: string[] = [];
    stderrData: string[] = [];

    constructor(readonly config: PSqlRunnerConfig, readonly args: string[], readonly stopOnError = true) {
        super();
        this.process = spawn(config.psqlExecutable, this.makeArgs());
        this.process.on('exit', this.onExit.bind(this));
        this.process.on('error', this.onError.bind(this));
        this.setupCapture();
        setTimeout(this.onTimeout.bind(this), config.timeout);
    }

    private setupCapture() {
        this.process.stdout.on('data', data => this.stdoutData.push(data.toString()));
        this.process.stderr.on('data', data => this.stderrData.push(data.toString()));
    }

    private makeArgs() {
        return ['-d', this.config.uri, ...(this.stopOnError ? ['-v', 'ON_ERROR_STOP=1'] : []), ...this.args];
    }

    private onTimeout() {
        if (!this.exited) {
            this.process.kill();
        }
        this.emit('timeout');
        setTimeout(this.onTimeout.bind(this), this.config.timeout);
    }

    private onError(err: any) {
        console.error('PSqlRunnerConfig encountered an error when running its subprocess');
        console.error(err);
        this.emit('error');
    }

    private onExit(code: number, signal: string) {
        this.exitCode = code;
        this.exitSignal = signal;
        this.exited = true;
        this.emit('exit');
    }

    joinRunner() {
        if (this.exited) {
            return new Promise(resolve => resolve());
        } else {
            return new Promise(resolve => {
                this.once('exit', () => {
                    resolve();
                });
            })
        }
    }

    get stdout() {
        return this.process.stdout;
    }

    get exitOk() {
        return this.exitCode === 0;
    }
}
