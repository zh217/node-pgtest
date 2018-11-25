"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var yargs_1 = __importDefault(require("yargs"));
var chalk_1 = __importDefault(require("chalk"));
var pgtap_runner_1 = require("./pgtap_runner");
var test_discovery_1 = require("./test_discovery");
var file_watcher_1 = require("./file_watcher");
var argv = yargs_1.default
    .describe('config', 'config file to use')
    .alias('c', 'config')
    .default('c', './pgtest_config.json')
    .describe('watch', 'Watch directory for changes')
    .boolean('w')
    .alias('w', 'watch')
    .default('w', false)
    .describe('init', 'Run init script only and then stop')
    .alias('i', 'init')
    .boolean('init')
    .default('init', false)
    .describe('nuke', 'Run nuke script only and then stop')
    .alias('x', 'nuke')
    .boolean('nuke')
    .default('nuke', false)
    .describe('bare', 'Skip init/nuke; run the tests only')
    .alias('b', 'bare')
    .default('b', false)
    .boolean('stopOnError')
    .alias('s', 'noStopOnError')
    .describe('s', 'Do not stop on first error encountered')
    .default('s', false)
    .argv;
var cwd = process.cwd();
function makeAbsolutePath(filePath, rootDir) {
    if (path_1.default.isAbsolute(filePath)) {
        return path_1.default.normalize(filePath);
    }
    if (!rootDir) {
        return path_1.default.normalize(path_1.default.join(cwd, filePath));
    }
    if (path_1.default.isAbsolute(rootDir)) {
        return path_1.default.normalize(path_1.default.join(rootDir, filePath));
    }
    return path_1.default.normalize(path_1.default.join(cwd, rootDir, filePath));
}
var defaultConfig = require('../pgtest_config.json');
var userConfigPath = makeAbsolutePath(argv.config);
var userConfig;
try {
    userConfig = JSON.parse(fs_1.default.readFileSync(userConfigPath).toString());
}
catch (e) {
    console.error(chalk_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Requested config file {bold.red ", "} does not exist!"], ["Requested config file {bold.red ", "} does not exist!"])), userConfigPath));
    process.exit(1);
}
var combinedConfig = __assign({}, defaultConfig, userConfig);
console.log(chalk_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{white CONF {gray ", "}}"], ["{white CONF {gray ", "}}"])), userConfigPath));
var basePath = path_1.default.join(path_1.default.dirname(userConfigPath), combinedConfig.directory);
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var tests, runner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_discovery_1.getAllTestFiles(basePath, combinedConfig.testDiscoveryGlob)];
                case 1:
                    tests = _a.sent();
                    runner = new pgtap_runner_1.PgTapRunner({
                        initScript: makeAbsolutePath(combinedConfig.initScript, basePath),
                        nukeScript: makeAbsolutePath(combinedConfig.nukeScript, basePath),
                        testScript: makeAbsolutePath(combinedConfig.testScript, basePath),
                        stopOnError: !argv.s,
                        initOnly: argv.init,
                        nukeOnly: argv.nuke,
                        tests: tests,
                        bareRun: argv.bare
                    }, {
                        psqlExecutable: combinedConfig.psqlExecutable,
                        uri: combinedConfig.connectionUri,
                        timeout: combinedConfig.testTimeout
                    });
                    return [4 /*yield*/, runner.start()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
if (!argv.w) {
    run().then(function () {
        process.exit(0);
    }).catch(function (err) {
        console.error(err);
        process.exit(1);
    });
}
else {
    var running_1 = false;
    var dirty_1 = false;
    var watcher_1 = new file_watcher_1.FileWatcher(basePath, /\.sql$/i);
    var doRun_1 = function () {
        var changed = __spread(watcher_1.flush());
        if (changed.length) {
            console.log();
            console.log(chalk_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{white CHNG} {gray detected: ", "}"], ["{white CHNG} {gray detected: ", "}"])), changed.join(', ')));
        }
        running_1 = true;
        run().then(function () {
            if (dirty_1) {
                dirty_1 = false;
                doRun_1();
            }
            else {
                running_1 = false;
            }
        });
    };
    watcher_1.on('changed', function () {
        if (running_1) {
            dirty_1 = true;
        }
        else {
            dirty_1 = false;
            doRun_1();
        }
    });
    doRun_1();
}
var templateObject_1, templateObject_2, templateObject_3;
