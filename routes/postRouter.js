const { Router } = require("express");

const postRouter = Router();

const db = require("../db/queries");

// postRouter.get("/drafts/:authorId", async (req, res) => {
//   const { authorId } = req.params;

//   const drafts = await db.getAllPostsByAuthor(authorId);

//   console.log("All drafts by author log");
//   res.json(drafts);
// });

// postRouter.get("/:authorId", async (req, res) => {
//   const { authorId } = req.params;

//   const posts = await db.getAllPostsByAuthor(authorId);

//   console.log("All posts by author log");
//   res.json(posts);
// });

// postRouter.get("/drafts", async (req, res) => {
//   const posts = await db.getAllPosts();

//   console.log("All drafts log");
//   res.json(posts);
// });

postRouter.get("/", async (req, res) => {
  const posts = await db.getAllPosts();

  console.log("All posts log");
  res.json(posts);
});

postRouter.put("/drafts/:postId", async (req, res) => {
  console.log("stigao draft");
  const { postId } = req.params;
  const { title, text, published } = req.body;
  const draft = await db.updatePost(postId, title, text, published);

  res.json(draft);
});

postRouter.put("/:postId/edit", async (req, res) => {
  console.log("stigao edit post");
  const { postId } = req.params;
  const { title, text } = req.body;
  const draft = await db.updatePost(postId, title, text);

  res.json(draft);
});

postRouter.post("/", async (req, res) => {
  const { id, title, text, authorId, published } = req.body;
  const post = await db.postNewPost(id, title, text, authorId, published);
  console.log("Post created");
  res.json(post);
});

// postRouter.get("/:postId/:comments/:commentId", async (req, res) => {
//   const post = await db.getPost("testpost");
//   console.log("bravo legendo");
//   res.json(post);
// });

// postRouter.get("/:postId/:comments", async (req, res) => {
//   const { postId } = req.params;
//   const comments = await db.getPostComments(postId);
//   console.log("bravo komentaru");
//   res.json(comments);
// });

postRouter.put("/:postId/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  const comment = await db.editComment(commentId, text);
  console.log("bravo komentaru");
  res.json(comment);
});

postRouter.delete("/:postId/:commentId", async (req, res) => {
  console.log("stigao delete");
  const { commentId } = req.params;
  const comment = await db.deleteComment(commentId);
  console.log("bravo obrisani komentaru");
  res.json(comment);
});

postRouter.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  //   const post = await db.getPost(postId);
  const post = await db.getPost(postId);
  console.log("bravo legendo");
  res.json(post);
});

postRouter.post("/:postId", async (req, res) => {
  const { postId } = req.params;

  const { text, authorId, userId } = req.body;
  const parentId = postId;
  const comment = await db.postNewComment(text, userId, authorId, parentId);
  console.log("bravo legendo");
  res.json(comment);
});

postRouter.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await db.deletePost(postId);
  console.log("bravo legendo");
  res.json(post);
});

// indexRouter.get("/", async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const folder = await db.getFolderById(folderId);
//     res.render("index", {
//       user: req.user,
//       folder: folder,
//       format: formatFileSize,
//     });
//   } catch (error) {
//     console.error("Error fetching types:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// indexRouter.get("/:postId/", async (req, res) => {
//   try {
//     const { folderId } = req.params;
//     const folder = await db.getFolderById(folderId);
//     res.render("index", {
//       user: req.user,
//       folder: folder,
//       format: formatFileSize,
//     });
//   } catch (error) {
//     console.error("Error fetching types:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// indexRouter.post("/:folderId/delete-file/:fileId", async (req, res) => {
//   try {
//     const { folderId, fileId } = req.params;
//     const result = await db.postDeleteFile(fileId);
//     const folder = await db.getFolderById(folderId);
//     res.render("index", {
//       user: req.user,
//       folder: folder,
//       format: formatFileSize,
//     });
//   } catch (error) {
//     console.error("Error fetching types:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// indexRouter.post("/:folderId/delete-folder/:childId", async (req, res) => {
//   try {
//     const { folderId, childId } = req.params;
//     const result = await db.postDeleteFolder(childId);

//     const folder = await db.getFolderById(folderId);
//     res.render("index", {
//       user: req.user,
//       folder: folder,
//       format: formatFileSize,
//     });
//   } catch (error) {
//     console.error("Error fetching types:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// indexRouter.post("/:parentId/add-folder", async (req, res) => {
//   try {
//     const { title, parentId } = req.body;
//     await db.postNewFolder(title, req.user.id, parentId);
//     const folder = await db.getFolderById(parentId);
//     res.render("index", {
//       user: req.user,
//       folder: folder,
//       format: formatFileSize,
//     });
//   } catch (error) {
//     console.error("Error fetching types:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// indexRouter.post(
//   "/:parentId/upload",
//   upload.single("file"),
//   async function (req, res, next) {
//     const file = req.file;
//     if (!file) return res.status(400).send("No file uploaded");

//     const fileName = `${Date.now()}-${file.originalname}`;

//     const { data, error } = await supabase.storage
//       .from("file-uploader")
//       .upload(fileName, file.buffer, {
//         contentType: file.mimetype,
//       });

//     if (error) {
//       console.error(error);
//       return res.status(500).send("Failed to upload to Supabase");
//     }

//     const fileUrl = `https://wowijotfrwfnvnjpvvre.supabase.co/storage/v1/object/public/file-uploader/${fileName}`;

//     const { parentId } = req.body;
//     await db.postNewFile(
//       fileName,
//       fileUrl,
//       req.user.id,
//       parentId,
//       req.file.size
//     );
//     const folder = await db.getFolderById(parentId);

//     res.redirect(`/${parentId}/`);
//   }
// );

module.exports = postRouter;
