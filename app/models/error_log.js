'use strict';

let _ = require('lodash')
  , mongoose = require('mongoose');

let schema = new mongoose.Schema({
  created: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }
}, {
  strict: false
});

/**
 * @param {Error|string} error
 * @param {Object} [data]
 */
schema.statics.add = function(error, data) {
  let log = {};

  if (_.isString(error)) {
    log = { message: error };
  } else if (error instanceof Error) {
    log = _.extend({}, error, { name: error.name, message: error.message, stack: error.stack, constructor: undefined });
  }
  _.extend(log, data);

  return this.create(log);
};

module.exports = mongoose.model('ErrorLog', schema);
