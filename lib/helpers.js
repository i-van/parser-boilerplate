'use strict';

let crypto = require('crypto');

/**
 * @param {number} time
 * @returns {Promise}
 */
module.exports.delay = function(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
};

/**
 * @param {Date|number} date
 * @returns {Date}
 */
module.exports.startOfDay = function(date) {
  date = date ? new Date(date) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * @param {Date|number} date
 * @returns {Date}
 */
module.exports.endOfDay = function(date) {
  date = date ? new Date(date) : new Date();
  date.setHours(24, 0, 0, 0);
  return date;
};

/**
 * @param {string} string
 * @returns {string}
 */
module.exports.md5 = function(string) {
  return crypto.createHash('md5')
    .update(string).digest('hex');
};
