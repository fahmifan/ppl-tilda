const { Router } = require('express')
const user = require('./user');
const login = require('./login');

const r = Router();
module.exports = ({ sAuth, sUser }) => {
  r.use(user({ sAuth, sUser }));
  r.use(login({ sAuth }));

  return r;
}