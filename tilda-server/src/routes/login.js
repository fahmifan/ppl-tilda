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
module.exports = ({ sAuth }) => {
  r.post('/login', [
    check('email').isEmail().exists().withMessage('invalid email'),
    check('password').isString().exists().withMessage('invalid password')
  ], 
  validate, 
  async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await sAuth.login({ email, password });

    if (!user) return res.status(404).json({ error: "unknown user" });
    return res.status(200).json({ user, token });
  });

  return r;
};
