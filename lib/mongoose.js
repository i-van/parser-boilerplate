'use strict';

let mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_DSN || 'mongodb://localhost:27017/parser');

module.exports = mongoose;
