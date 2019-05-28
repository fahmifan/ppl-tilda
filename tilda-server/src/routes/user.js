const r = require('express').Router();
const faker = require('faker');
const { check, validationResult } = require('express-validator/check');

const { asyncwrap } = require('../utils')
const { logger } = require('../logger')

/**
 * @typedef {import('mongoose').Model} Model
 */

/**
 * @param {{ UserModel: Model }}
 */
module.exports = ({ UserModel }) => {  
  r.post('/users/', (req, res) => {
    try {
      const newUser = new UserModel({
        name: faker.name.findName(),
        pictURL: faker.internet.avatar(),
        email: faker.internet.email(),
        telp: faker.phone.phoneNumber(),
      });
  
      newUser.save((err, user) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ error: err.message });
        }
        return res.status(200).json({ message: 'created' });
      });
  
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: e.message });
    }
  });
  
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
  
  r.post('/users/:id/progress',[
    check('unixdate').exists().isNumeric().withMessage('unknown unixdate'),
    // duration is in second
    check('duration').exists().isNumeric().withMessage('unknown duration'),
  ], asyncwrap(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const userId = req.params.id;
    const { unixdate, duration } = req.body;

    try {
      const user = await UserModel.findById(userId);
      user.progress.push({ duration, unixdate });
      await user.save();
  
      return res.status(200).json(user);
    } catch (e) {
      logger.error(e);
      return res.status(400).json({ error: 'cannot update progress' })
    }
  }));

  return r;
}
