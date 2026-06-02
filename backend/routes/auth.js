const express = require("express");
const { User } = require("../db/models");

const router = express.Router();

router.get("/current", (req, res) =>
  req.session.user ? res.json(req.session.user) : res.status(401).send("Unauthorized"),
);

router.post("/login", async (req, res) => {
  const login_name = (req.body.login_name || "").trim();
  const password = req.body.password || "";
  if (!login_name) 
    return res.status(400).send("login_name is required");

  const user = await User.findOne({ login_name });
  if (!user || user.password !== password) 
    return res.status(400).send("Invalid login_name or password");

  req.session.user = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    login_name: user.login_name,
  };
  res.json(req.session.user);
});

router.post("/logout", (req, res) => {
  if (!req.session.user) 
    return res.status(400).send("Not logged in");
  req.session.destroy((err) => (err ? res.status(500).send("Logout failed") : res.send("OK")));
});

module.exports = router;
