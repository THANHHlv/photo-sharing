/** Từ chối request nếu chưa đăng nhập (session). */
function requireUser(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).send("Unauthorized");
}

module.exports = requireUser;
