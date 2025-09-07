const { Router } = require("express");

const { Prisma } = require("@prisma/client");

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
  res.json(posts);
});

dashboardRouter.post("/posts", authenticateAuthor, async (req, res) => {
  const { id, title, text, published } = req.body;
  const authorId = req.user.id;

  try {
    const post = await db.postNewPost(id, title, text, authorId, published);
    console.log("Post created");
    res.status(201).json(post);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.meta?.target?.includes("title")
    ) {
      return res
        .status(409)
        .json({ message: "A post with this title already exists." });
    }
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

dashboardRouter.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  //   const post = await db.getPost(postId);
  const post = await db.getPost(postId);
  console.log("bravo legendo");
  res.json(post);
});

dashboardRouter.put("/posts/:postId", authenticateAuthor, async (req, res) => {
  const { postId } = req.params;
  const { title, text, published } = req.body;

  try {
    const post = await db.updatePost(postId, title, text, published);
    console.log("Post updated");
    res.status(200).json(post);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.meta?.target?.includes("title")
    ) {
      return res
        .status(409)
        .json({ message: "A post with this title already exists." });
    }
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

dashboardRouter.put("/drafts/:postId", authenticateAuthor, async (req, res) => {
  const { postId } = req.params;
  const { title, text, published } = req.body;

  try {
    const draft = await db.updatePost(postId, title, text, published);
    console.log("Draft updated");
    res.status(200).json(draft);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.meta?.target?.includes("title")
    ) {
      return res
        .status(409)
        .json({ message: "A post with this title already exists." });
    }
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

dashboardRouter.put("/:postId/edit", async (req, res) => {
  console.log("stigao edit post");
  const { postId } = req.params;
  const { title, text } = req.body;
  const draft = await db.updatePost(postId, title, text);

  res.json(draft);
});

module.exports = dashboardRouter;
