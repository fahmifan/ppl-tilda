const express = require('express');
const { Router } = require('express');
const path = require('path');
const faker = require('faker');
const mongoose = require('mongoose');

const app = express();
const r = Router();

const config = {
  PORT: process.env.PORT || '8080',
  ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'mongodb://localhost/ppl-tilda',
}

// connect to db
mongoose.connect(config.DB_URL, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connect to mongodb');
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  pictURL: String,
  telp: String,
});

const UserModel = mongoose.model('User', userSchema);

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
      console.log(user);

      if (err) {
        return res.status(400).json({ error: err.message });
      }

      return res.status(200).json({ message: 'created' });
    });

  } catch (e) {
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
})

app.use('/', express.static(path.join(__dirname, '../frontend')));
app.use('/api', r);

app.listen(config.PORT, () => {
  console.log(`starting ${config.ENV} server at :${config.PORT}`);
});