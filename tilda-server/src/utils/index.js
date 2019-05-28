exports.asyncwrap = fn => (...args) => fn(...args).catch(args[2])

exports.validate = require('./validator');
module.exports = exports;
