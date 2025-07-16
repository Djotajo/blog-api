const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const passErr =
  "must be at least 8 characters long and include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.";

const validateUser = [
  //   body("firstName")
  //     .trim()
  //     .isAlpha()
  //     .withMessage(`First name ${alphaErr}`)
  //     .isLength({ min: 1, max: 10 })
  //     .withMessage(`FirstName ${lengthErr}`),
  //   body("lastName")
  //     .trim()
  //     .isAlpha()
  //     .withMessage(`Last name ${alphaErr}`)
  //     .isLength({ min: 1, max: 10 })
  //     .withMessage(`Last name ${lengthErr}`),
  body("username")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  //   body("password")
  //     .isStrongPassword({
  //       minLength: 3,
  //       minLowercase: 1,
  //       minUppercase: 1,
  //       minNumbers: 1,
  //       minSymbols: 1,
  //     })
  //     .withMessage(`Password ${passErr}`),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

exports.newUserCreate = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      console.error("Validation failed for login request:", errors.array());
      return res.status(401).json({
        message: "Auth failed, wrong password",
        errors: errors.array(),
      });
      //   return res.status(400).render("form", {
      //     title: "Create user",
      //     errors: errors.array(),
      //   });
    }
    try {
      const { username, password } = req.body;
      console.log("ovdje stiglo");
      //   const isAdmin = req.body.isAdmin === "on";

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.postNewUser(username, hashedPassword);
      return res.status(200).json({
        message: "User created",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        message: "Random error",
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];
