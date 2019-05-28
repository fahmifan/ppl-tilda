const r = require('express').Router();
const { check } = require('express-validator/check');
const { logger } = require('../logger')
const { validate } = require('../utils')

/**
 * @typedef {import('mongoose').Model} Model
 */

/**
 * @param {{ UserModel: Model }}
 */
module.exports = ({ UserModel }) => {
  r.post('/login', [
    check('email').isEmail().exists().withMessage('invalid email'),
    check('password').isString().exists().withMessage('invalid password')
  ], 
  validate, 
  (req, res) => {
    const { email, password } = req.body;

    UserModel.findOne({ email }, (err, user) => {
      if (err) {
        logger.error(err);
        return res.status(400).json(err);
      }

      if (!user || user.password !== password) {
        return res.status(404).json({ error: "unknown user" });
      }

      return res.status(200).json(user);
    });
  });

  return r;
};
