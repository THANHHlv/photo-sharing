const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const { User, Photo } = require("../db/models");
const requireUser = require("../middleware/requireUser");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "images");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) =>
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname) || ".jpg"}`),
  }),
});

router.post("/photos/new", requireUser, upload.single("uploadedphoto"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("no-file");
  }

  const photo = await Photo.create({
    file_name: req.file.filename,
    date_time: new Date(),
    user_id: req.session.user._id,
    comments: [],
  });

  res.json({
    _id: photo._id,
    file_name: photo.file_name,
    date_time: photo.date_time,
    user_id: photo.user_id,
  });
});

router.get("/photosOfUser/:id", requireUser, async (req, res) => {
  const { id } = req.params;

  const userExists = await User.findById(id);
  if (!userExists) {
    return res.status(400).send("invalid-id");
  }

  const photos = await Photo.find({ user_id: id }, "_id user_id comments file_name date_time");
  const userIds = [...new Set(photos.flatMap((p) => (p.comments || []).map((c) => String(c.user_id))))];

  const users = userIds.length ? await User.find({ _id: { $in: userIds } }, "_id first_name last_name") : [];
  const userMap = {};
  users.forEach((u) => {
    userMap[String(u._id)] = u;
  });

  res.json(
    photos.map((p) => ({
      _id: p._id,
      user_id: p.user_id,
      file_name: p.file_name,
      date_time: p.date_time,
      comments: (p.comments || []).map((c) => ({
        _id: c._id,
        comment: c.comment,
        date_time: c.date_time,
        user: userMap[String(c.user_id)] || null,
      })),
    })),
  );
});

router.get("/commentsOfUser/:id", requireUser, async (req, res) => {
  const { id } = req.params;

  const userExists = await User.findById(id);
  if (!userExists) {
    return res.status(400).send("invalid-id");
  }

  const photos = await Photo.find({ "comments.user_id": id }, "_id user_id file_name comments");
  
  const comments = photos.flatMap((p) =>
    (p.comments || [])
      .filter((c) => String(c.user_id) === id)
      .map((c) => ({
        _id: c._id,
        comment: c.comment,
        date_time: c.date_time,
        photo_id: p._id,
        photo_user_id: p.user_id,
        file_name: p.file_name,
      })),
  );

  comments.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
  res.json(comments);
});

router.post("/commentsOfPhoto/:photo_id", requireUser, async (req, res) => {
  const { photo_id } = req.params;
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).send("empty");
  }

  const photo = await Photo.findById(photo_id);
  if (!photo) {
    return res.status(400).send("not-found");
  }

  const newCmt = {
    comment: comment.trim(),
    date_time: new Date(),
    user_id: req.session.user._id,
  };

  photo.comments.push(newCmt);
  await photo.save();

  const savedCmt = photo.comments.at(-1);
  const user = await User.findById(req.session.user._id, "_id first_name last_name");

  res.json({
    _id: savedCmt._id,
    comment: savedCmt.comment,
    date_time: savedCmt.date_time,
    user,
  });
});

module.exports = router;