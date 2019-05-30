const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  pictURL: String,
  password: String,
  telp: String,
  progress: Array,
  callHistory: Array,
});

const authSchema = new mongoose.Schema({
  userID: String,
  token: String,
});

exports.UserModel = mongoose.model('User', userSchema);
exports.AuthModel = mongoose.model('Auth', authSchema);

module.exports = exports;
