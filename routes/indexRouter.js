const { Router } = require("express");

const indexRouter = Router();

const db = require("../db/queries");

// indexRouter.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);

//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Session destruction failed:", err);
//         return res.status(500).send("Could not log out.");
//       }

//       res.clearCookie("my-session");
//       res.redirect("/");
//     });
//   });
// });

indexRouter.get("/", async (req, res) => {
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
