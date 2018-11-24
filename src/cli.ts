import yargs from 'yargs';


const argv = yargs
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