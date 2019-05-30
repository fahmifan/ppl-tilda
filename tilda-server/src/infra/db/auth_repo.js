
const authOfToken = async ({ AuthModel, token }) => {
  const authData = await AuthModel.findOne({ token });
  console.log(token, authData);
  return Promise.resolve(authData);
};

const save = ({ AuthModel, authData }) => new Promise((resolve, reject) => {
  const newAuthData = new AuthModel(authData);

  newAuthData.save((err, authData) => {
    if (err) return reject(err);
    return resolve(authData);
  });
});

const authOfUserID = async ({ AuthModel, userID }) => {
  return await AuthModel.findOne({ userID: userID+"" });
}

module.exports = ({ AuthModel }) => ({
  authOfToken: (token) => authOfToken({ AuthModel, token }),
  authOfUserID: (userID) => authOfUserID({ AuthModel, userID }),
  save: (authData) => save({ AuthModel, authData }),
});
