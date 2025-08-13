const express = require("express");
const path = require("node:path");

const app = express();
require("dotenv").config();

const http = require("http");
const db = require("./db/queries");
const { neon } = require("@neondatabase/serverless");
const bcrypt = require("bcryptjs");
const sql = neon(process.env.DATABASE_URL);
const assetsPath = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;

const expressSession = require("express-session");
// const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require("passport");
const jwtStrategry = require("./strategies/jwt");
passport.use(jwtStrategry);

app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const indexRouter = require("./routes/indexRouter");
const postRouter = require("./routes/postRouter");

const newUserController = require("./controllers/newUserController");

app.use(express.static(path.join(__dirname, "public")));

// --- Enable CORS for all routes ---
app.use(cors());
// ----------------------------------

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use("/", indexRouter);

app.use("/posts", postRouter);

app.post("/login", async (req, res) => {
  let { username, password } = req.body;

  const user = await db.getUser(username);

  console.log(user);
  if (!user) {
    console.log("no user");
    return res
      .status(401)
      .json({ message: "Auth failed, username does not exist" });
  }
  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return res.status(401).json({ message: "Auth failed, wrong password" });
  }

  const signOpts = {};
  signOpts.expiresIn = 1200; //token expires in 2min
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    console.error("JWT_SECRET environment variable is not set!");
    return res.status(500).json({ message: "Server configuration error." });
  }

  const token = jwt.sign(
    { username: user.username, id: user.id },
    secret,
    signOpts
  );
  return res.status(200).json({
    message: "Auth Passed",
    token,
  });
});

app.post("/signup", newUserController.newUserCreate);

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send("YAY! this is a protected Route");
  }
);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
