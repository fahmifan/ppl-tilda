/**
 * @typedef {import('mongoose').Model} Model
 */

/**
 * @param {{ UserModel: Model }}
 */
const userOfID = async ({ UserModel, userID }) => {
  UserModel.findOne({ _id: userID }, (err, user) => {
    if (err) return Promise.reject(err);
    return Promise.resolve(user)
  });
}

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
const userOfEmail = ({ UserModel, email }) => new Promise((resolve, reject) => {
  UserModel.findOne({ email }, (err, user) => {
    if (err) return reject(err);
    return resolve(user);
  });
});

module.exports = ({ UserModel }) => ({
  userOfID: (id) => userOfID({ UserModel, userID: id }),
  userOfEmail: (email) => userOfEmail({ UserModel, email }),
  save: (data) => save({ UserModel, data }),
});
