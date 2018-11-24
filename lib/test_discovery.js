"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var glob_1 = __importDefault(require("glob"));
var path_1 = __importDefault(require("path"));
function getAllTestFiles(baseDir, testGlob) {
    return new Promise(function (resolve, reject) {
        glob_1.default(combineGlobWithBaseDir(baseDir, testGlob), function (err, files) {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
}
exports.getAllTestFiles = getAllTestFiles;
function combineGlobWithBaseDir(baseDir, testGlob) {
    var outPath;
    if (path_1.default.isAbsolute(baseDir)) {
        outPath = baseDir;
    }
    else {
        outPath = path_1.default.join(process.cwd(), baseDir);
    }
    outPath = path_1.default.normalize(outPath);
    return outPath + testGlob;
}
exports.combineGlobWithBaseDir = combineGlobWithBaseDir;
