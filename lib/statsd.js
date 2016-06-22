'use strict';

let StatsdClient = require('statsd-client');

module.exports = new StatsdClient({
  host: process.env.STATSD_HOST || 'localhost',
  port: process.env.STATSD_PORT || 8125,
  prefix: process.env.STATSD_PREFIX || 'parser'
});
