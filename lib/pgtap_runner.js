"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var psql_runner_1 = require("./psql_runner");
var tap_reporter_1 = require("./tap_reporter");
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var INIT_PREAMBLE = path_1.default.normalize(path_1.default.join(__dirname, '..', 'resource', 'init_preamble.sql'));
var TEST_SETUP = path_1.default.normalize(path_1.default.join(__dirname, '..', 'resource', 'test_setup.sql'));
var TEST_PREAMBLE = path_1.default.normalize(path_1.default.join(__dirname, '..', 'resource', 'test_preamble.sql'));
var PgTapRunner = /** @class */ (function () {
    function PgTapRunner(config, runnerConfig) {
        this.config = config;
        this.runnerConfig = runnerConfig;
        this.onlyMode = config.initOnly || config.nukeOnly;
    }
    PgTapRunner.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startAt, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log();
                        startAt = Date.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!!this.config.bareRun) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prepare()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!!this.onlyMode) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.runTests()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        // console.log();
                        console.log("> DONE in " + ('' + (Date.now() - startAt)) + "ms");
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        // console.error(e);
                        // console.log();
                        console.log(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["> {red FAILED} in ", "ms"], ["> {red FAILED} in ", "ms"])), '' + (Date.now() - startAt)));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PgTapRunner.prototype.prepare = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runNuke()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.runInit()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.runTestInit()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PgTapRunner.prototype.runNuke = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startAt, runner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.config.bareRun || (this.onlyMode && this.config.nukeOnly)) {
                            return [2 /*return*/];
                        }
                        startAt = Date.now();
                        process.stdout.write(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{white > NUKE with {bold ", "}}"], ["{white > NUKE with {bold ", "}}"])), this.config.nukeScript));
                        runner = new psql_runner_1.PSqlRunner(this.runnerConfig, ['-f', INIT_PREAMBLE, '-f', this.config.nukeScript], false);
                        return [4 /*yield*/, runner.joinRunner()];
                    case 1:
                        _a.sent();
                        console.log(" in " + (Date.now() - startAt) + "ms");
                        if (runner.stderrData.length) {
                            console.log(chalk_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), runner.stderrData.join('')));
                        }
                        if (!runner.exitOk) {
                            throw Error('runNuke encountered problems');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PgTapRunner.prototype.runInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startAt, runner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.config.bareRun || (this.onlyMode && this.config.initOnly)) {
                            return [2 /*return*/];
                        }
                        startAt = Date.now();
                        process.stdout.write(chalk_1.default(templateObject_4 || (templateObject_4 = __makeTemplateObject(["{white > INIT with {bold ", "}}"], ["{white > INIT with {bold ", "}}"])), this.config.initScript));
                        runner = new psql_runner_1.PSqlRunner(this.runnerConfig, ['-f', INIT_PREAMBLE, '-f', this.config.initScript]);
                        return [4 /*yield*/, runner.joinRunner()];
                    case 1:
                        _a.sent();
                        console.log(" in " + (Date.now() - startAt) + "ms");
                        if (runner.stderrData.length) {
                            console.log(chalk_1.default(templateObject_5 || (templateObject_5 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), runner.stderrData.join('')));
                        }
                        if (!runner.exitOk) {
                            throw Error('runInit encountered problems');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PgTapRunner.prototype.runTestInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startAt, runner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.config.bareRun || this.onlyMode) {
                            return [2 /*return*/];
                        }
                        startAt = Date.now();
                        process.stdout.write(chalk_1.default(templateObject_6 || (templateObject_6 = __makeTemplateObject(["{white > TEST-INIT with {bold ", "}}"], ["{white > TEST-INIT with {bold ", "}}"])), this.config.testScript));
                        runner = new psql_runner_1.PSqlRunner(this.runnerConfig, ['-f', INIT_PREAMBLE, '-f', TEST_SETUP, '-f', this.config.testScript]);
                        return [4 /*yield*/, runner.joinRunner()];
                    case 1:
                        _a.sent();
                        console.log(" in " + (Date.now() - startAt) + "ms");
                        if (runner.stderrData.length) {
                            console.log(chalk_1.default(templateObject_7 || (templateObject_7 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), runner.stderrData.join('')));
                        }
                        if (!runner.exitOk) {
                            throw Error('runTest encountered problems');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PgTapRunner.prototype.runTests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, _b, _c, test_1, e_2_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (this.onlyMode) {
                            return [2 /*return*/];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _b = __values(this.config.tests), _c = _b.next();
                        _d.label = 2;
                    case 2:
                        if (!!_c.done) return [3 /*break*/, 5];
                        test_1 = _c.value;
                        return [4 /*yield*/, this.runTest(test_1)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _c = _b.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    PgTapRunner.prototype.runTest = function (test) {
        return __awaiter(this, void 0, void 0, function () {
            var runner, reporter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log();
                        process.stdout.write(chalk_1.default(templateObject_8 || (templateObject_8 = __makeTemplateObject(["{white > TEST {bold ", "}} "], ["{white > TEST {bold ", "}} "])), test));
                        runner = new psql_runner_1.PSqlRunner(this.runnerConfig, ['-f', TEST_PREAMBLE, '-f', test]);
                        reporter = new tap_reporter_1.TapReporter(runner.stdout);
                        return [4 /*yield*/, runner.joinRunner()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, reporter.result];
                    case 2:
                        result = _a.sent();
                        if (runner.stderrData.length) {
                            console.log(chalk_1.default(templateObject_9 || (templateObject_9 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), runner.stderrData.join('')));
                        }
                        if ((!result || runner.stderrData.length) && this.config.stopOnError) {
                            console.log(chalk_1.default(templateObject_10 || (templateObject_10 = __makeTemplateObject(["{white > STOP on failure in {bold.red ", "}}"], ["{white > STOP on failure in {bold.red ", "}}"])), test));
                            throw Error('Encountered problem on running script');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return PgTapRunner;
}());
exports.PgTapRunner = PgTapRunner;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
