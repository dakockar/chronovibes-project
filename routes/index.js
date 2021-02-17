const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.session.loggedInUser) res.redirect('/home');
  else res.render("index");
});

module.exports = router;
