'use strict';

let Task = require('../app/models/task');

module.exports = {
  async up() {
    await Task.collection.ensureIndex({ status: 1, runAt: 1, priority: -1 });
    await Task.collection.ensureIndex({ status: 1, started: 1 });
  },

  async down() {
    await Task.collection.dropIndex({ status: 1, runAt: 1, priority: -1 });
    await Task.collection.dropIndex({ status: 1, started: 1 });
  }
};
