const { Router } = require("express");

const express = require("express");
const jwt = require("jsonwebtoken");

const dashboardRouter = Router();

const db = require("../db/queries");

function authenticateAuthor(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "author") {
      return res.status(403).json({ message: "Forbidden: Not an author" });
    }

    req.user = decoded; // Pass data to route handler
    next();
  } catch (err) {
    console.error("JWT verification failed", err);
    return res.status(401).json({ message: "Token verification failed" });
  }
}

dashboardRouter.get("/posts", authenticateAuthor, async (req, res) => {
  const authorId = req.user.id;
  const posts = await db.getAllPostsByAuthor(authorId);

  console.log("Dashboard all posts by author log");
  res.json(posts);
});

dashboardRouter.post("/posts", async (req, res) => {
  const { id, title, text, authorId, published } = req.body;
  const post = await db.postNewPost(id, title, text, authorId, published);
  console.log("Post created");
  res.json(post);
});

dashboardRouter.put("/drafts/:postId", async (req, res) => {
  console.log("stigao draft");
  const { postId } = req.params;
  const { title, text, published } = req.body;
  const draft = await db.updatePost(postId, title, text, published);

  res.json(draft);
});

dashboardRouter.put("/:postId/edit", async (req, res) => {
  console.log("stigao edit post");
  const { postId } = req.params;
  const { title, text } = req.body;
  const draft = await db.updatePost(postId, title, text);

  res.json(draft);
});

module.exports = dashboardRouter;
