const { asyncwrap } = require('../utils');

module.exports = ({ sAuth }) => ({
  user: asyncwrap(async (req, res, next) => {
    const token = req.headers.authorization;
    const authData = await sAuth.user(token);

    if (!authData) return res.status(401).json({ error: "user not allowed" });
    return next();
  }),
});
