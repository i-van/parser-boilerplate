'use strict';

let mongoose = require('mongoose');

const MAX_ATTEMPTS = 3;

const STATUS_PENDING    = 'PENDING';
const STATUS_IN_PROCESS = 'IN_PROCESS';
const STATUS_FAILED     = 'FAILED';
const STATUS_FINISHED   = 'FINISHED';

let schema = new mongoose.Schema({
  started: { type: Date, default: Date.now },
  status: { type: String, default: STATUS_PENDING },
  runAt: { type: Date, default: Date.now },
  priority: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  timeTaken: Number,
  params: Object,
  name: String
});

/**
 * Statuses
 */
schema.statics.STATUS_PENDING    = STATUS_PENDING;
schema.statics.STATUS_IN_PROCESS = STATUS_IN_PROCESS;
schema.statics.STATUS_FINISHED   = STATUS_FINISHED;

/**
 * @returns {Promise}
 */
schema.statics.pop = function() {
  let query = {
        status: STATUS_PENDING,
        runAt: { $lt: new Date() }
      }
    , update = {
        $set: { status: STATUS_IN_PROCESS, started: Date.now() },
        $inc: { attempts: 1 }
      };

  return this.findOneAndUpdate(query, update, { sort: { priority: -1 } }).exec();
};

/**
 * @param {string} name
 * @param {Object} [params]
 * @param {number} [priority]
 * @param {Date} [runAt]
 * @returns {Promise}
 */
schema.statics.push = function(name, params, priority, runAt) {
  runAt || (runAt = new Date());
  priority || (priority = 0);
  params || (params = {});

  return this.create({ name, params, priority, runAt });
};

/**
 * set status PENDING when task was started 10 minutes ago
 *
 * @param {Function} done
 */
schema.statics.refresh = function(done) {
  let date = new Date();
  date.setMinutes(date.getMinutes() - 10);

  this.update(
    { status: STATUS_IN_PROCESS, started: { $lte: date } },
    { status: STATUS_PENDING },
    { multi: true },
    done
  )
};

/**
 * @returns {Promise}
 */
schema.methods.finish = function() {
  return this.remove();
};

/**
 * @returns {Promise}
 */
schema.methods.retry = function() {
  if (this.attempts >= MAX_ATTEMPTS) {
    this.status = STATUS_FAILED;
  } else {
    // retry after 5 minutes
    this.status = STATUS_PENDING;
    this.runAt = new Date(Date.now() + 5 * 60 * 1000);
  }

  return this.save();
};

module.exports = mongoose.model('Task', schema);
