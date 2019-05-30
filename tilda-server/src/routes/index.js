const { Router } = require('express')
const AuthService = require('../app/auth_service');
const UserRepository = require('../infra/db/user_repo');
const AuthRepository = require('../infra/db/auth_repo');

const user = require('./user');
const login = require('./login');

const r = Router();
module.exports = (model) => {
  const { UserModel, AuthModel } = model;
  const userRepo = UserRepository({ UserModel });
  const authRepo = AuthRepository({ AuthModel });
  const sAuth = AuthService({ userRepo, authRepo });

  r.use(user({ sAuth }));
  r.use(login({ UserModel, sAuth }));

  return r;
}