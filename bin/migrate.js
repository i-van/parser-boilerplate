'use strict';

let Umzug = require('umzug');

let argv = require('yargs')
  .usage('Usage: $0 <command> [options]')

  .command('pending', 'list of pending migrations')
  .command('executed', 'list of executed migrations')
  .command('up [name]', 'migrate up till given migration')
  .command('down [name]', 'migrate down till given migration')
  //.command('create [title]', 'create a new migration file with optional [title]')
  .demand(1)

  .help('help')
  .alias('help', 'h')
  .argv;

let app = require('../bootstrap');

let umzug = new Umzug({
  storage: __dirname + '/../lib/mongo_storage'
});
let command = argv._[0];

umzug[command]()
  .then(function(migrations) {
    migrations.forEach(item => console.log(item.file));
  })
  .catch(function(err) {
    console.log('Error:');
    console.log(err);
    console.log(err.stack);
  })
  .then(function() {
    app.shutdown();
  });
