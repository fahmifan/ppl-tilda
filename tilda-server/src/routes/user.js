const r = require('express').Router();
const faker = require('faker');
const { validate, asyncwrap } = require('../utils')
const { logger } = require('../logger')
const { check } = require('express-validator/check');


/**
 * @typedef {import('mongoose').Model} Model
 */

/**
 * @param {{ UserModel: Model }}
 */
module.exports = ({ UserModel }) => {
  // create user
  r.post('/users/', [
    check('name').exists().isString().withMessage('unknown name'),
    check('pictURL').exists().isString().withMessage('unknown pictURL'),
    check('email').exists().isString().withMessage('unknown email'),
    check('password').exists().isString().withMessage('unknown password'),
    check('telp').exists().isString().withMessage('unknown telp'),
  ],
  validate,
  asyncwrap(async (req, res) => {
    const {
      name, pictURL, email, telp, password
    } = req.body

    const newUser = new UserModel({
      name, pictURL, email, telp, password
    });

    newUser.save((err, user) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
      }
      return res.status(200).json({ message: 'created' });
    });  
  }));
  
  // get a user
  r.get('/users/:id', (req, res) => {
    UserModel.find((err, users) => {
      if (err) {
        console.error('error', err);
        return res.status(400).json({ error: err.message });
      }
  
      const userInfo = users.length >= req.params.id-1 ? users[req.params.id-1] : {}
  
      return res.status(200).json(userInfo);
    })
  });

  // update user progress
  r.post('/users/:id/progress',
    [
      check('unixdate').exists().isNumeric().withMessage('unknown unixdate'),
      // duration is in second
      check('duration').exists().isNumeric().withMessage('unknown duration'),
    ], 
    validate, 
    asyncwrap(async (req, res) => {
      const userId = req.params.id;
      const { unixdate, duration } = req.body;

      const user = await UserModel.findById(userId);
      user.progress.push({ duration, unixdate });
      await user.save();

      return res.status(200).json(user);
    }
  ));

  return r;
}
