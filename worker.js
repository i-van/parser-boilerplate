'use strict';

require('./bootstrap');

let worker = require('./lib/worker');

let argv = require('yargs')
  .usage('Usage: $0 --count <number>')
  .option('count', {
    alias: 'c',
    demand: true,
    default: 1,
    describe: 'count of workers',
    type: 'number'
  })
  .argv;

// run workers
console.log('[%s] Started %d workers', new Date(), argv.count);
for (let i = 0; i < argv.count; i++) {
  worker(i + 1);
}
