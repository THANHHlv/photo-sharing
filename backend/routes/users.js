const express = require("express");
const mongoose = require("mongoose");
const { User, Photo } = require("../db/models");
const requireUser = require("../middleware/requireUser");

const router = express.Router();
const bad = (res, msg) => res.status(400).send(msg);

router.post("/", async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
  if (!login_name || !password || !first_name || !last_name) 
    return bad(res, "missing");
  if (await User.findOne({ login_name })) 
    return bad(res, "exists");

  const user = await User.create({
    login_name,
    password,
    first_name,
    last_name,
    location: location || "",
    description: description || "",
    occupation: occupation || "",
  });
  res.json({ _id: user._id, login_name: user.login_name, first_name: user.first_name, last_name: user.last_name });
});

router.get("/list", requireUser, async (req, res) => {
  const users = await User.find({}, "_id first_name last_name");
  const photos = await Photo.find({}, "user_id comments.user_id");
  const photoCnt = {};
  const cmtCnt = {};

  photos.forEach((p) => {
    photoCnt[String(p.user_id)] = (photoCnt[String(p.user_id)] || 0) + 1;
    (p.comments || []).forEach((c) => {
      cmtCnt[String(c.user_id)] = (cmtCnt[String(c.user_id)] || 0) + 1;
    });
  });

  res.json(
    users.map((u) => ({
      _id: u._id,
      first_name: u.first_name,
      last_name: u.last_name,
      photo_count: photoCnt[String(u._id)] || 0,
      comment_count: cmtCnt[String(u._id)] || 0,
    })),
  );
});

router.get("/:id", requireUser, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) 
    return bad(res, "invalid-id");
  const user = await User.findById(id, "_id first_name last_name location description occupation");
  if (!user) 
    return bad(res, "invalid-id");
  res.json(user);
});

module.exports = router;
