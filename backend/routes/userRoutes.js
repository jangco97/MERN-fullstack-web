const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/userControllers");
const multerUpload = require("../middleware/multerUpload");
const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  multerUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

module.exports = router;
