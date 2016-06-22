'use strict';

let helpers = require('./helpers')
  , taskManager = require('./task_manager')
  , Task = require('../app/models/task')
  , ErrorLog = require('../app/models/error_log')
  , statsd = require('../bootstrap').services.statsd;

/**
 * @param {number} name
 */
async function worker(name) {
  let debug = require('debug')('worker:' + name);

  while (true) {
    let task = await Task.pop()
      , started = new Date();

    try {
      if (!task) {
        debug('queue is empty, delay 1 minute');
        await helpers.delay(60 * 1000);
        continue;
      }

      debug('task (%s %j) started', task.name, task.params);
      await taskManager.run(task.name, task.params);
      debug('task (%s %j) finished', task.name, task.params);

      await task.finish();
      statsd.timing(['worker', task.name].join('.'), started);
      statsd.timing('worker.task', started);
    } catch (err) {
      await task.retry();
      ErrorLog.add(err, { type: 'worker', task });
      statsd.timing(['worker', task.name, 'failed'].join('.'), started);
      statsd.timing('worker.task.failed', started);
    }
  }
}

module.exports = worker;
