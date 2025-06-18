const { Router } = require("express");

const postRouter = Router();

const db = require("../db/queries");

postRouter.get("/:postId", async (req, res) => {
  const post = await db.getPost("testpost");
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
