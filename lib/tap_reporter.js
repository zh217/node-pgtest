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
var tap_out_1 = __importDefault(require("tap-out"));
var stream_1 = require("stream");
var chalk_1 = __importDefault(require("chalk"));
var TapReporter = /** @class */ (function () {
    function TapReporter(outStream) {
        var _this = this;
        this.startAt = Date.now();
        this.tap = tap_out_1.default();
        outStream.pipe(this.tap);
        this.setupTap();
        this.result = new Promise(function (resolve, reject) {
            _this.tap.on('output', function (res) {
                var e_1, _a;
                var timeTaken = Date.now() - _this.startAt;
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
                process.stdout.write(" in " + timeTaken + "ms\n");
                var ok = !(res.fail.length || res.errors.length);
                try {
                    // for (const assert of res.asserts) {
                    //     if (!assert.ok) {
                    //         console.log(chalk`{red FAILED {bold #${assert.number} ${assert.name || ''}}}`);
                    //         console.log(assert.error);
                    //     }
                    // }
                    for (var _b = __values(res.tests), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var test_1 = _c.value;
                        var raw = test_1.raw.slice(2);
                        if (raw.startsWith('Looks like you failed')) {
                            continue;
                        }
                        if (raw[0] !== ' ') {
                            console.log(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{bold.red ", "}"], ["{bold.red ", "}"])), raw));
                        }
                        else {
                            console.log(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), raw));
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // for (const error of res.errors) {
                //     console.log(chalk`{red ERROR: {bold ${error.message}}}`);
                // }
                // console.log(res);
                if (!ok) {
                    console.log();
                }
                resolve(ok);
            });
        });
    }
    TapReporter.prototype.setupTap = function () {
        // this.tap.on('test', test => console.log('test', test));
        // this.tap.on('assert', assert => console.log('assert', assert));
        this.tap.on('pass', function () { return process.stdout.write(chalk_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{green .}"], ["{green .}"])))); });
        this.tap.on('fail', function () { return process.stdout.write(chalk_1.default(templateObject_4 || (templateObject_4 = __makeTemplateObject(["{bold.red F}"], ["{bold.red F}"])))); });
        this.tap.on('error', function () { return process.stdout.write(chalk_1.default(templateObject_5 || (templateObject_5 = __makeTemplateObject(["{bold.red E}"], ["{bold.red E}"])))); });
        // this.tap.on('comment', comment => console.log('comment', comment));
    };
    TapReporter.prototype.reportStage = function (stage, path) {
        console.log('STAGE', stage, path);
    };
    TapReporter.prototype.reportOut = function (outData) {
        console.log('OUT', outData);
    };
    TapReporter.prototype.reportErr = function (errData) {
        console.log('ERR', errData);
    };
    TapReporter.prototype.reportTap = function (outData, errData, exitOk, exitCode, exitSignal) {
        return __awaiter(this, void 0, void 0, function () {
            var tapResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTapResult(outData)];
                    case 1:
                        tapResult = _a.sent();
                        console.log(tapResult);
                        return [2 /*return*/];
                }
            });
        });
    };
    TapReporter.prototype.getTapResult = function (outData) {
        return new Promise(function (resolve, reject) {
            var e_2, _a;
            var outStream = tap_out_1.default(function (output, whatever) {
                console.log(output, whatever);
                resolve(output);
            });
            var readable = new stream_1.Readable();
            readable.pipe(outStream);
            try {
                for (var outData_1 = __values(outData), outData_1_1 = outData_1.next(); !outData_1_1.done; outData_1_1 = outData_1.next()) {
                    var chunk = outData_1_1.value;
                    readable.push(chunk);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (outData_1_1 && !outData_1_1.done && (_a = outData_1.return)) _a.call(outData_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            readable.push(null);
        });
    };
    return TapReporter;
}());
exports.TapReporter = TapReporter;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
