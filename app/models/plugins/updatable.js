
module.exports = function(schema, options) {
  schema.add({
    created: { type: Date, default: Date.now },
    updated: Date
  });

  schema.pre('save', function(next) {
    this.updated = Date.now();
    this.increment();
    next();
  });
};
