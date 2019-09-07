const r = require('express').Router();
const { validate, asyncwrap } = require('../utils')
const { check } = require('express-validator/check');
const AuthMiddleware = require('./auth_middleware');

module.exports = ({ sAuth, sUser, sImage }) => {
  const authorize = AuthMiddleware({ sAuth });
  /**
   * @api {post} /users Register (Create User)
   * @apiName CreateUser
   * @apiGroup User
   * 
   * @apiParam {String} name Name of User
   * @apiParam {String} email Email of User
   * @apiParam {String} password Password of User
   * @apiParam {String} telp Telphone number of User
   * 
   * @apiSuccess {Object} user User data
   */
  r.post('/users/',
  [
    check('name').exists().isString().withMessage('unknown name'),
    check('email').exists().isString().withMessage('unknown email'),
    check('password').exists().isString().withMessage('unknown password'),
    check('telp').exists().isString().withMessage('unknown telp'),
  ],
  validate,
  asyncwrap(async (req, res) => {
    const {
      name, pictURL, email, telp, password
    } = req.body

    const user = await sAuth.regUser({ name, pictURL, email, telp, password });
    if (!user) return res.status(400).json({ error: "cannot register user" });
    return res.status(200).json(user);
  }));
  
  /**
   * @api {get} /user/:id Get User By ID
   * @apiName GetUserByID
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization
   * @apiParam {String} id ID of User
   * 
   * @apiSuccess {Object} user User data
   */
  r.get('/users/:id', authorize.user, asyncwrap(async (req, res) => {  
    const user = await sUser.userOfID(req.params.id);
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.status(200).json(user);
  }));

  /**
   * @api {post} /user/:id/progress Add Progress
   * @apiName AddProgress
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization Token userd for authorization 
   * @apiParam {String} id ID of User
   * @apiParam {Number} unixdate Unix datetime
   * @apiParam {Number} duration Duration of progress
   * 
   * @apiSuccess {Object} user User data
   */
  r.post('/users/:id/progress', authorize.user, [
      check('unixdate').exists().isNumeric().withMessage('unknown unixdate'),
      // duration is in second
      check('duration').exists().isNumeric().withMessage('unknown duration'),
    ], validate, asyncwrap(async (req, res) => {
      const { unixdate, duration } = req.body;
      const user = await sUser.saveProgress(req.params.id, { unixdate, duration });
      return res.status(200).json(user);
    })
  );

  /**
   * @api {post} /user/:id/photo Upload Photo
   * @apiName UploadPhoto
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization Token userd for authorization 
   * @apiParam {String} id ID of User
   * @apiParam {Object} photo Photo  
   * @apiSuccess {Object} user User data
   */
  r.post('/users/:id/photo', authorize.user, sImage.upPhoto, asyncwrap(async (req, res) => {
    const photoPath = await sImage.savePhoto(req.params.id, req.file.originalname);
    return res.status(200).json({ photoPath });
  }));

  return r;
}
