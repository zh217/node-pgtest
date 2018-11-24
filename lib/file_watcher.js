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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chokidar_1 = __importDefault(require("chokidar"));
var events_1 = __importDefault(require("events"));
var FileWatcher = /** @class */ (function (_super) {
    __extends(FileWatcher, _super);
    function FileWatcher(baseDir, pattern) {
        var _this = _super.call(this) || this;
        _this.baseDir = baseDir;
        _this.pattern = pattern;
        _this.changedFiles = new Set();
        _this.watcher = chokidar_1.default.watch(baseDir, { ignoreInitial: true });
        _this.watcher.on('add', _this.onWatcherEvent.bind(_this));
        _this.watcher.on('change', _this.onWatcherEvent.bind(_this));
        _this.watcher.on('unlink', _this.onWatcherEvent.bind(_this));
        return _this;
    }
    FileWatcher.prototype.onWatcherEvent = function (path) {
        if (this.pattern.test(path)) {
            this.changedFiles.add(path);
            this.emit('changed');
        }
    };
    FileWatcher.prototype.flush = function () {
        var ret = new Set(this.changedFiles);
        this.changedFiles.clear();
        return ret;
    };
    return FileWatcher;
}(events_1.default));
exports.FileWatcher = FileWatcher;
