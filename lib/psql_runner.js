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
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var events_1 = require("events");
var PSqlRunner = /** @class */ (function (_super) {
    __extends(PSqlRunner, _super);
    function PSqlRunner(config, args) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.args = args;
        _this.exited = false;
        _this.exitCode = null;
        _this.exitSignal = null;
        _this.process = child_process_1.spawn(config.psqlExecutable, _this.makeArgs());
        _this.process.on('exit', _this.onExit.bind(_this));
        _this.process.on('error', _this.onError.bind(_this));
        setTimeout(_this.onTimeout.bind(_this), config.timeout);
        return _this;
    }
    PSqlRunner.prototype.makeArgs = function () {
        return ['-d', this.config.uri, '-v', 'ON_ERROR_STOP=1'].concat(this.args);
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
    Object.defineProperty(PSqlRunner.prototype, "stderr", {
        get: function () {
            return this.process.stderr;
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
