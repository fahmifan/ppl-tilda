const express = require('express');
const { Router } = require('express');
const path = require('path');

const app = express();
const r = Router();

r.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.use('/', express.static(path.join(__dirname, '../frontend')));
app.use('/api', r);

const config = {
  PORT: process.env.PORT || '8080',
  ENV: process.env.NODE_ENV || 'development',
}

app.listen(config.PORT, () => {
  console.log(`starting ${config.ENV} server at :${config.PORT}`);
});