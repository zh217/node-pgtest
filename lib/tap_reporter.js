"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var chalk_1 = __importDefault(require("chalk"));
var TapReporter = /** @class */ (function () {
    function TapReporter(outStream) {
        var _this = this;
        this.startAt = Date.now();
        this.tap = tap_out_1.default();
        outStream.pipe(this.tap);
        this.setupTap();
        this.result = new Promise(function (resolve) {
            _this.tap.on('output', function (res) {
                var e_1, _a;
                var timeTaken = Date.now() - _this.startAt;
                process.stdout.write(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{gray  in {blue ", "}ms}\n"], ["{gray  in {blue ", "}ms}\\n"])), '' + timeTaken));
                var ok = !(res.fail.length || res.errors.length);
                try {
                    for (var _b = __values(res.tests), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var test_1 = _c.value;
                        var raw = test_1.raw.slice(2);
                        if (raw.startsWith('Looks like you failed')) {
                            continue;
                        }
                        if (raw[0] !== ' ') {
                            console.log(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{bold.red ", "}"], ["{bold.red ", "}"])), raw));
                        }
                        else {
                            console.log(chalk_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{red ", "}"], ["{red ", "}"])), raw));
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
                if (!ok) {
                    console.log();
                }
                resolve(ok);
            });
        });
    }
    TapReporter.prototype.setupTap = function () {
        this.tap.on('pass', function () { return process.stdout.write(chalk_1.default(templateObject_4 || (templateObject_4 = __makeTemplateObject(["{green .}"], ["{green .}"])))); });
        this.tap.on('fail', function () { return process.stdout.write(chalk_1.default(templateObject_5 || (templateObject_5 = __makeTemplateObject(["{bold.red F}"], ["{bold.red F}"])))); });
        this.tap.on('error', function () { return process.stdout.write(chalk_1.default(templateObject_6 || (templateObject_6 = __makeTemplateObject(["{bold.red E}"], ["{bold.red E}"])))); });
    };
    return TapReporter;
}());
exports.TapReporter = TapReporter;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
