const { Router } = require('express')

const user = require('./user');

module.exports = (model) => {
  const apiRoute = Router();
  
  // inject dependencies
  apiRoute.use(user(model));

  return apiRoute;
}