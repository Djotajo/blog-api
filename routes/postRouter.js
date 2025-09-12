const { Router } = require("express");

const postRouter = Router();

const db = require("../db/queries");

// GET ALL POSTS
postRouter.get("/", async (req, res) => {
  const posts = await db.getAllPosts();
  res.json(posts);
});

// GET POST BY ID

postRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await db.getPost(postId);
  res.json(post);
});

// POST NEW COMMENT

postRouter.post("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { text, userId, authorId } = req.body;
  const parentId = postId;

  const comment = await db.postNewComment(text, userId, authorId, parentId);
  res.json(comment);
});

// EDIT COMMENT

postRouter.put("/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  const comment = await db.editComment(commentId, text);
  res.json(comment);
});

// DELETE COMMENT

postRouter.delete("/:postId/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const comment = await db.deleteComment(commentId);
  res.json(comment);
});

// postRouter.get("/:authorId", async (req, res) => {
//   const { authorId } = req.params;

//   const posts = await db.getAllPostsByAuthor(authorId);

//   console.log("All posts by author log");
//   res.json(posts);
// });

module.exports = postRouter;
