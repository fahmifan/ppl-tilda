/**
 * @typedef {import('mongoose').Model} Model
 */

/**
 * @param {{ UserModel: Model }}
 */
const userOfID = async ({ UserModel, userID }) => {
  const user = await UserModel.findById(userID);
  return Promise.resolve(user)
};

/**
 * @param {{ UserModel: Model }}
 */
const save = ({ UserModel, data }) => new Promise((resolve, reject) => {
  const newUser = new UserModel(data);

  newUser.save((err, user) => {
    if (err) return reject(err);
    return resolve(user);
  });
});

/**
 * @param {{ UserModel: Model }}
 */
const userOfEmail = async ({ UserModel, email }) => {
  try {
    const user = await UserModel.findOne({ email });
    return Promise.resolve(user);
  } catch (e) {
    return Promise.reject(e);
  }
};

const saveProgress = async ({ UserModel, userID, progress }) => {
  const user = await UserModel.findById(userID);
  console.log('progress', progress);
  user.progress.push(progress);
  await user.save();
  return Promise.resolve(user);
};

module.exports = ({ UserModel }) => ({
  userOfID: (userID) => userOfID({ UserModel, userID }),
  userOfEmail: (email) => userOfEmail({ UserModel, email }),
  save: (data) => save({ UserModel, data }),
  saveProgress: (userID, progress) => saveProgress({ UserModel, userID, progress }),
});
