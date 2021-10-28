const Router = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");

// import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  userController.register
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/me", userController.getMe);

module.exports = router;
