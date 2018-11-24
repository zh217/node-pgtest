"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var events_1 = require("events");
var PSqlRunner = /** @class */ (function (_super) {
    __extends(PSqlRunner, _super);
    function PSqlRunner(config, args, stopOnError) {
        if (stopOnError === void 0) { stopOnError = true; }
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.args = args;
        _this.stopOnError = stopOnError;
        _this.exited = false;
        _this.exitCode = null;
        _this.exitSignal = null;
        _this.stdoutData = [];
        _this.stderrData = [];
        _this.process = child_process_1.spawn(config.psqlExecutable, _this.makeArgs());
        _this.process.on('exit', _this.onExit.bind(_this));
        _this.process.on('error', _this.onError.bind(_this));
        _this.setupCapture();
        setTimeout(_this.onTimeout.bind(_this), config.timeout);
        return _this;
    }
    PSqlRunner.prototype.setupCapture = function () {
        var _this = this;
        this.process.stdout.on('data', function (data) { return _this.stdoutData.push(data.toString()); });
        this.process.stderr.on('data', function (data) { return _this.stderrData.push(data.toString()); });
    };
    PSqlRunner.prototype.makeArgs = function () {
        return __spread(['-d', this.config.uri], (this.stopOnError ? ['-v', 'ON_ERROR_STOP=1'] : []), this.args);
    };
    PSqlRunner.prototype.onTimeout = function () {
        if (!this.exited) {
            this.process.kill();
        }
        this.emit('timeout');
        setTimeout(this.onTimeout.bind(this), this.config.timeout);
    };
    PSqlRunner.prototype.onError = function (err) {
        console.error('PSqlRunnerConfig encountered an error when running its subprocess');
        console.error(err);
        this.emit('error');
    };
    PSqlRunner.prototype.onExit = function (code, signal) {
        this.exitCode = code;
        this.exitSignal = signal;
        this.exited = true;
        this.emit('exit');
    };
    PSqlRunner.prototype.joinRunner = function () {
        var _this = this;
        if (this.exited) {
            return new Promise(function (resolve) { return resolve(); });
        }
        else {
            return new Promise(function (resolve) {
                _this.once('exit', function () {
                    resolve();
                });
            });
        }
    };
    Object.defineProperty(PSqlRunner.prototype, "stdout", {
        get: function () {
            return this.process.stdout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PSqlRunner.prototype, "exitOk", {
        get: function () {
            return this.exitCode === 0;
        },
        enumerable: true,
        configurable: true
    });
    return PSqlRunner;
}(events_1.EventEmitter));
exports.PSqlRunner = PSqlRunner;
