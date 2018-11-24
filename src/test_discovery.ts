import glob from 'glob';
import path from 'path';

export function getAllTestFiles(baseDir: string, testGlob: string) {
    return new Promise((resolve, reject) => {
        glob(combineGlobWithBaseDir(baseDir, testGlob), (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

export function combineGlobWithBaseDir(baseDir: string, testGlob: string) {
    let outPath;

    if (path.isAbsolute(baseDir)) {
        outPath = baseDir;
    } else {
        outPath = path.join(process.cwd(), baseDir);
    }

    outPath = path.normalize(outPath);
    return outPath + testGlob;
}