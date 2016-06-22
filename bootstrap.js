'use strict';

let fs = require('fs');

require('dotenv').load();

require('babel-register')({
  plugins: ['transform-async-to-generator'],

  // transform only *.js files from project
  // that have at least one async/await word
  ignore(file) {
    if (!file.endsWith('.js')) {
      return true;
    }

    if (file.indexOf('node_modules') !== -1) {
      return true;
    }

    let body = fs.readFileSync(file);
    return (
      body.indexOf('async') === -1 &&
      body.indexOf('await') === -1
    );
  }
});

let glob = require('glob')
  , taskManager = require('./lib/task_manager');

let app = {
  services: {
    statsd: require('./lib/statsd'),
    mongoose: require('./lib/mongoose')
  },

  shutdown() {
    this.services.mongoose.disconnect();
    this.services.statsd.close();
  }
};

// register all tasks
glob.sync('./app/tasks/**/*.js', { cwd: __dirname }).map(file => {
  let Task = require(file);

  taskManager.register(Task.name, Task);
});

module.exports = app;
