const express = require('express');
const mongoose = require('mongoose');
const server = require('http');
const path = require('path');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const router = require('./routes');
const { loggerMiddleware } = require('./logger')

const service = require('./app');
const { repo, model } = require('./infra');

const app = express();
const http = server.Server(app);
const ws = socketIo(http);

const config = {
  PORT: process.env.PORT || '8080',
  ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'mongodb://localhost/ppl-tilda',
}

const sessions = {}

// connect to db
mongoose.connect(config.DB_URL, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connect to mongodb');

  const userRepo = repo.UserRepo({ UserModel: model.UserModel });
  const authRepo = repo.AuthRepo({ AuthModel: model.AuthModel });

  const services = {
    sAuth: service.auth({ userRepo, authRepo }),
    sUser: service.user({ userRepo }),
    sImage: service.image({ userRepo }),
  }

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  app.use(loggerMiddleware());
  app.get('/api/ping', (_, res) => res.status(200).json({ message: 'pong' }));
  app.use('/api', router(services));
  
  const sVideocall = service.videocall({ ws, sessions });
  sVideocall.call();

  http.listen(config.PORT, () => {
    console.log(`starting ${config.ENV} server at http://localhost:${config.PORT}`);
  });
});
