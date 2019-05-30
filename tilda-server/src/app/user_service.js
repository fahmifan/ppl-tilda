const { logger } = require('../logger')

const userOfID = async ({ userRepo, userID }) => {
  try {
    const user = await userRepo.userOfID(userID);
    return Promise.resolve(user);
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
}

const saveProgress = async ({ userRepo, userID, progress }) => {
  try {
    const user = await userRepo.saveProgress(userID, progress);
    return Promise.resolve(user);
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
}

module.exports = ({ userRepo }) => ({
  userOfID: (userID) => userOfID({ userRepo, userID }),
  saveProgress: (userID, progress) => saveProgress({ userRepo, userID, progress }), 
});