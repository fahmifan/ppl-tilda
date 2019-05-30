const express = require('express');
const mongoose = require('mongoose');
const server = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const router = require('./routes');
const { loggerMiddleware } = require('./logger')

const { AuthService, UserService } = require('./app');
const { repo, model } = require('./infra');

const app = express();
const http = server.Server(app);
const io = socketIo(http);

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
    sAuth: AuthService({ userRepo, authRepo }),
    sUser: UserService({ userRepo }),
  }

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());

  app.use(loggerMiddleware());
  app.get('/api/ping', (req, res) => res.status(200).json({ message: 'pong' }));
  app.use('/api', router(services));
  
  io.on('connection', (socket) => {
    console.log('#connect')
    socket.user = {}

    socket.on('register', (id) => {
      console.log('id', id);
      if (!id || id.length < 3) {
        return socket.emit('reg-result', { result: 0, message: 'id must be at least 3 character' })
      }

      socket.user.id = id

      // check existing connection
      if (!sessions[id]) { // host
        socket.user.isHost = true
        sessions[id] = { host: socket.user, hostSocket: socket }
        socket.emit('reg-result', { result: 1 })
      } else { // client
        socket.user.isHost = false
        sessions[id].remote = socket.user
        sessions[id].remoteSocket = socket
        socket.emit('reg-result', { result: 2, host: sessions[id].host })
      }
    });

    socket.on('sdp', function (desc) {
      console.log('% sdp', socket.user.id, !!desc)
      socket.user.desc = desc
      if (getPartner()) {
        getPartner().emit('sdp', desc)
      }
    })
  
    socket.on('ice-new', function (ice) {
      console.log('% ice', socket.user.id, !!ice)
      socket.user.ice = ice
      if (getPartner()) {
        getPartner().emit('ice-new', ice)
      }
    })
  
    socket.on('disconnect', function () {
      console.log('* disconnect', socket.user.id, socket.user.isHost)
  
      if (getPartner()) {
        getPartner().emit('partner-disconnected', 1)
      }
  
      delete sessions[socket.user.id]
    })
  
    function getPartner() {
      if (!sessions[socket.user.id]) return false
  
      if (socket.user.isHost && sessions[socket.user.id].remoteSocket) {
        return sessions[socket.user.id].remoteSocket
      } else if (!socket.user.isHost && sessions[socket.user.id].hostSocket) {
        return sessions[socket.user.id].hostSocket
      }
      return false
    }
  })

  http.listen(config.PORT, () => {
    console.log(`starting ${config.ENV} server at http://localhost:${config.PORT}`);
  });
});