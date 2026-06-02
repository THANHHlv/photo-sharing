const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const dbConnect = require("./db/dbConnect");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const photoRouter = require("./routes/photos");
require("dotenv").config();

const app = express();
const client = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors({ origin: client, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "photo-sharing-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false },
  }),
);

dbConnect();

const imagesDir = path.join(__dirname, "images");
fs.mkdirSync(imagesDir, { recursive: true });
app.use("/images", express.static(imagesDir));

app.use("/admin", authRouter);
app.use("/user", userRouter);
app.use("/", photoRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello photo-sharing app ThanhLe!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
