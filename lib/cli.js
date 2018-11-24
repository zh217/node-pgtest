"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
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
    .argv;
console.dir(argv);
