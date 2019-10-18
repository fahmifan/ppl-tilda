require('dotenv').config()

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', proxy({
    target: process.env.API_PROXY_URL,
    changeOrigin: true,
  }));

  app.use('/bot', proxy({
    target: process.env.BOT_PROXY_URL,
    changeOrigin: true,
  }));
};