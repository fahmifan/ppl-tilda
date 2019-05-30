const { logger } = require('../logger');
const util = require('../utils');
const { promisify } = require('util');
const crypto = require('crypto');

const regUser = async ({ userRepo, user }) => {
  try {
    // check if user exists
    const isThere = await userRepo.userOfEmail(user.email);
    if (isThere) {
      return Promise.resolve(null);
    }
  
    // hashing the password
    const hashpw = await util.password.gen(user.password);
    const newUser = await userRepo.save({ ...user, password: hashpw });
    
    // don't return password
    newUser.password = null
    delete newUser.password
    return Promise.resolve(newUser);
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
}

const login = async ({ userRepo, authRepo, user }) => {
  try {
    const foundUser = await userRepo.userOfEmail(user.email);
    if (!foundUser) return Promise.resolve(null);
  
    const isPwMatch = await util.password.check(user.password, foundUser.password);
    if (!isPwMatch) return Promise.resolve(null);
    foundUser.password = null;
  
    // gen token and save it to db
    const tokenBuff = crypto.randomBytes(16);
    const token = tokenBuff.toString('hex');
    await authRepo.save({ token });

    return Promise.resolve({ user: foundUser, token });
  } catch(e) {
    logger.error(e);
    return Promise.reject(e);
  }
}

module.exports = ({ userRepo, authRepo }) => ({
  regUser: (user) => regUser({ userRepo, user }),
  login: (user) => login({ userRepo, authRepo, user }),
});