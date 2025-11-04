module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.position)) {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
};
