const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const router = require('./routes');

const { loggerMiddleware } = require('./logger')

const app = express();

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

app.use(loggerMiddleware());
app.use('/', express.static(path.join(__dirname, '../frontend')));
app.get('/api/ping', (req, res) => res.status(200).json({ message: 'pong' }));
app.use('/api', router({ UserModel }));

app.listen(config.PORT, () => {
  console.log(`starting ${config.ENV} server at :${config.PORT}`);
});