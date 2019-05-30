const authOfToken = async ({ AuthModel, token }) => {
  const authData = await AuthModel.findOne({ token });
  console.log(token, authData);
  return Promise.resolve(authData);
};

const save = async ({ AuthModel, authData }) => {
  const newAuthData = new AuthModel(authData);
  const authData = await newAuthData.save();
  return Promise.resolve(authData);
};

const authOfUserID = async ({ AuthModel, userID }) => {
  return await AuthModel.findOne({ userID: userID+"" });
}

module.exports = ({ AuthModel }) => ({
  authOfToken: (token) => authOfToken({ AuthModel, token }),
  authOfUserID: (userID) => authOfUserID({ AuthModel, userID }),
  save: (authData) => save({ AuthModel, authData }),
});
