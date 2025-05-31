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
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/indexRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
