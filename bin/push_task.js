'use strict';

let app = require('../bootstrap');

let Task = require('../app/models/task')
  , taskManager = require('../lib/task_manager');

let argv = require('yargs')
  .usage('Usage: $0 --task <string> [--params] [--remove]')

  .option('task', {
    alias: 't',
    demand: true,
    describe: 'task name',
    type: 'string'
  })

  .option('params', {
    describe: 'params of task'
  })

  .option('remove', {
    alias: 'r',
    default: false,
    describe: 'remove all tasks before adding new one',
    type: 'boolean'
  })

  .argv;

try {
  taskManager.getTask(argv.task);
} catch (err) {
  console.log('Unknown "%s" task', argv.task);
  process.exit();
}

Promise.resolve()
  .then(function() {
    return argv.remove
      ? Task.remove()
      : Promise.resolve();
  })
  .then(function() {
    return Task.push(argv.task, argv.params);
  })
  .then(function() {
    console.log('Task "%s" was added', argv.task);
    console.log('Params:', argv.params);
  }, function(err) {
    console.log('Error:');
    console.log(err);
  })
  .then(function() {
    app.shutdown();
  });
