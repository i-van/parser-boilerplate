'use strict';

let mongoose = require('mongoose');
let Migration = mongoose.model('Migration', new mongoose.Schema({
  name: String,
  applied: { type: Date, default: Date.now }
}));

class MongoStorage {
  constructor(options) {
    this.options = options;
  }

  logMigration(migrationName) {
    return Migration.create({ name: migrationName });
  }

  unlogMigration(migrationName) {
    return Migration.remove({ name: migrationName });
  }

  executed() {
    return Migration.find().then(rows => rows.map(row => row.name));
  }
}

module.exports = MongoStorage;
