const r = require('express').Router();
const { check } = require('express-validator/check');
const { validate, asyncwrap } = require('../utils')


module.exports = ({ sAuth }) => {
  /**
   * @api {post} /login Login
   * @apiName Login
   * @apiGroup Auth
   * 
   * @apiParam {String} email User email
   * @apiParam {String} password User password
   * 
   * @apiSuccess {Object} user Object
   * @apiSuccess {String} token User token
   */
  r.post('/login', [
    check('email').isEmail().exists().withMessage('invalid email'),
    check('password').isString().exists().withMessage('invalid password')
  ], 
  validate, 
  asyncwrap(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await sAuth.login({ email, password });

    if (!user) return res.status(404).json({ error: "unknown user" });
    return res.status(200).json({ user, token });
  }));

  return r;
};
