const { Router, static } = require('express')
const path = require('path');
const user = require('./user');
const login = require('./login');

const r = Router();
module.exports = ({ sAuth, sUser, sImage }) => {
  const photoPath = path.join(process.cwd(), 'static', 'upload', 'photo');

  r.use('/docs', static(path.join(__dirname, '..', '..', 'apidoc')));
  r.use('/image', static(photoPath));
  r.use(user({ sAuth, sUser, sImage }));
  r.use(login({ sAuth }));

  return r;
}