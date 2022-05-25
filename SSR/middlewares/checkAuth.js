module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.session.isAuthenticated) {
      return next();
    }
    res.redirect("/auth/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.session.isAuthenticated) {
      return next();
    }
    res.redirect("/account");
  },
  isAdmin: (req, res, next) => {
    if (req.session.user.isAdmin) {
      return next();
    }
    res.redirect("/");
  },
};
