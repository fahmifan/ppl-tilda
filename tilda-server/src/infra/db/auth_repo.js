
const authOfToken = ({ AuthModel, token }) => new Promise((resolve, reject) => {
  AuthModel.findOne({ token }, (err, authData) => {
    if (err) return reject(err);
    return resolve(authData);
  });
});

const save = ({ AuthModel, authData }) => new Promise((resolve, reject) => {
  const newAuthData = new AuthModel(authData);

  newAuthData.save((err, authData) => {
    if (err) return reject(err);
    return resolve(authData);
  });
});

module.exports = ({ AuthModel }) => ({
  authOfToken: (token) => authOfToken({ AuthModel, token }),
  save: (authData) => save({ AuthModel, authData }),
});
