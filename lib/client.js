'use strict';

let debug = require('debug')('client')
  , request = require('request')
  , _ = require('lodash')
  , Url = require('url')
  , helpers = require('./helpers');

class Client {
  constructor(baseUrl) {
    this.transformers = [];
    this.lastRequestAt = 0;
    this.delayBetweenRequests = 0;
    this.defaultRequestOptions = {
      jar: request.jar(),
      baseUrl
    };
  }

  addTransformer(transformer) {
    this.transformers.push(transformer);
  }

  get(url, options) {
    return this.request(
      Object.assign({}, options, { url, method: 'GET' })
    );
  }

  post(url, form, options) {
    return this.request(
      Object.assign({}, options, { url, method: 'POST', form })
    );
  }

  put(url, body, options) {
    return this.request(
      Object.assign({}, options, { url, method: 'PUT', body })
    );
  }

  patch(url, body, options) {
    return this.request(
      Object.assign({}, options, { url, method: 'PATCH', body })
    );
  }

  async request(options) {
    let difference = Date.now() - this.lastRequestAt;

    if (difference < this.delayBetweenRequests) {
      await helpers.delay(this.delayBetweenRequests - difference);
    }

    let res = await this._request(options);
    this.lastRequestAt = Date.now();
    this.transformers.forEach(transformer => transformer(res));

    return res;
  };

  _request(options) {
    options = _.merge({}, this.defaultRequestOptions, options);
    debug('%s %s', options.method, (options.baseUrl || '') + options.url);

    return new Promise(function(resolve, reject) {
      let host = Url.parse((options.baseUrl || '') + options.url).hostname
        , statsd = require('../bootstrap').services.statsd
        , started = new Date();

      request(options, function(err, res) {
        if (err) {
          return reject(err);
        }

        debug('%s %s', res.statusCode, res.statusMessage);
        statsd.timing('request.' + host, started);
        statsd.timing('request.all', started);
        resolve(res);
      });
    });
  }
}

module.exports = Client;
