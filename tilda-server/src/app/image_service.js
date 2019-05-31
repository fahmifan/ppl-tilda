const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const exec = require('child_process').execSync;
const fs = require('fs');

const { logger } = require('../logger');

const photoPath = path.join(process.cwd(), 'static', 'upload', 'photo');

let fileUploadName = ''
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(photoPath)) {
      exec(`mkdir -p ${photoPath}`);
      cb(null, path.join(photoPath));
      return;
    }

    cb(null, path.join(photoPath));
  },
  filename(req, file, cb) {
    const randName = crypto.randomBytes(8).toString('hex');
    fileUploadName = `${randName}${path.extname(file.originalname)}`;
    if (fs.existsSync(photoPath + '/' + fileUploadName)) {
      exec(`rm ${photoPath + '/' + fileUploadName}`);
    }

    cb(null, fileUploadName);
  },
});
const upPhoto = multer({ storage }).single('photo');

async function save({ userID, fileOriName, userRepo }) {
  try {
    const user = await userRepo.userOfID(userID);
    // const fileName = `${userID}${path.extname(fileOriName)}`;
    user.pictURL = path.join('/api/image/', fileUploadName);
    await userRepo.save(user);
    return Promise.resolve(user.pictURL);
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
}

module.exports = ({ userRepo }) => ({
  upPhoto,
  savePhoto: (userID, fileOriName) => save({ userID, userRepo, fileOriName }),
});