const bcrypt = require('bcryptjs');
const { logger } = require('../logger');

exports.gen = (plainpw) => new Promise((resolve, reject) => {
  bcrypt.hash(plainpw, 8, (err, hash) => {
    if (err) {
      logger.error(err);
      return reject(err);
    }

    return resolve(hash);
  });
});

exports.check = async (plain, hash) => {
  try {
    const isMatch = await bcrypt.compare(plain, hash)
    return Promise.resolve(isMatch);
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
}

module.exports = exports;
