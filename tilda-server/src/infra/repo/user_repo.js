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
const save = async ({ UserModel, data }) => {
  // update user
  if (data._id) {
    const user = await UserModel.findById(data._id)
    Object.keys(data).forEach(k => {
      user[k] = data[k]
    });

    const updatedUser = await user.save();
    return Promise.resolve(updatedUser);
  }

  // create new
  const newUser = new UserModel(data);
  const savedUser = await newUser.save();
  return Promise.resolve(savedUser);
};

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
