const { Router } = require("express");

const indexRouter = Router();

const db = require("../db/queries");

indexRouter.get("/:authorId", async (req, res) => {
  const { authorId } = req.params;
  const posts = await db.getAllPostsByAuthor(authorId);

  console.log("All posts by author log");
  console.log("je l se ovo aktivira braco");
  res.json(posts);
});

indexRouter.get("/", async (req, res) => {
  console.log("index router");
  //   if (req.user) {
  //     const root = await db.getRootFolder(req.user.id);
  //     res.render("index", {
  //       user: req.user,
  //       folder: root,
  //       format: formatFileSize,
  //     });
  //   } else {
  //     res.render("index");
  //   }
  // const root = await db.getRootFolder(req.user.id);
  // res.render("index", {
  //   user: req.user,
  //   folder: root,
  //   format: formatFileSize,
  // });
});

module.exports = indexRouter;
