const express = require('express');
const { Router } = require('express');
const path = require('path');
const faker = require('faker');

const app = express();
const r = Router();

r.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

r.get('/users/:id', (req, res) => {
  res.status(200).json({
    name: faker.name.findName(),
    pictURL: faker.internet.avatar(),
    email: faker.internet.email(),
    telp: faker.phone.phoneNumber(),
  });
})

app.use('/', express.static(path.join(__dirname, '../frontend')));
app.use('/api', r);

const config = {
  PORT: process.env.PORT || '8080',
  ENV: process.env.NODE_ENV || 'development',
}

app.listen(config.PORT, () => {
  console.log(`starting ${config.ENV} server at :${config.PORT}`);
});