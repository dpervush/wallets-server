const Router = require("express");
const statsController = require("../controllers/statsController");

const authMiddleware = require("../middlewares/authMiddleware.js");

const router = new Router();

router.get("/", authMiddleware, statsController.getStatByPeriod);
router.get("/categories", authMiddleware, statsController.getStatByCategory);
router.get("/cards", authMiddleware, statsController.getStatByCard);

module.exports = router;
