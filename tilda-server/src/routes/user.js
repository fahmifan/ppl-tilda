const r = require('express').Router();
const faker = require('faker');

/**
 * @typedef {import('mongoose').Model} Model
 */

/**
 * @param {{ UserModel: Model }}
 */
module.exports = ({ UserModel }) => {
  r.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
  });
  
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
  
  return r;
}
