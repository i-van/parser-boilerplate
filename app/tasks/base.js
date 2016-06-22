'use strict';

let Task = require('../models/task');

class BaseTask {
  constructor(params) {
    this.params = params;
  }

  pushTask(name, params, priority, runAt) {
    return Task.push(name, params, priority, runAt);
  }

  run() {
    throw new Error('run method should be implemented');
  }
}

module.exports = BaseTask;
