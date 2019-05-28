const { Router } = require('express')

const user = require('./user');

module.exports = (model) => {
  const r = Router();
  
  r.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
  });
  

  // inject dependencies
  r.use(user(model));

  return r;
}