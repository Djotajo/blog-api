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

  opts.expiresIn = 120; //token expires in 2min
  const secret = env("SECRET_KEY"); //normally stored in process.env.secret
  const token = jwt.sign({ username }, secret, opts);
  return res.status(200).json({
    message: "Auth Passed",
    token,
  });
});

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
