const { Router } = require('express')

const user = require('./user');
const login = require('./login');

const r = Router();
module.exports = (model) => {
  r.use(user(model));
  r.use(login(model))

  return r;
}