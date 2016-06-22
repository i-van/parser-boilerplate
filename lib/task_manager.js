'use strict';

let list = {};

/**
 * @param {string} name
 * @returns {Function}
 */
function getTask(name) {
  let Task = list[name];

  if (!Task) {
    // critical error, halt process
    throw new Error('task "' + name + '" not found');
  }

  return Task;
}
module.exports.getTask = getTask;

/**
 * @param {string} name
 * @param {Function} Task
 */
module.exports.register = function(name, Task) {
  list[name] = Task;
};

/**
 * @param {string} name
 * @param {Object} params
 * @returns {Promise}
 */
module.exports.run = function(name, params) {
  let Task = getTask(name)
    , task = new Task(params);

  return task.run();
};
