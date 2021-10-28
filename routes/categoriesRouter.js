const Router = require("express");
const categoriesController = require("../controllers/categoriesController");

const authMiddleware = require("../middlewares/authMiddleware.js");

const router = new Router();

router.post("/", authMiddleware, categoriesController.create);
router.get("/", authMiddleware, categoriesController.getAll);
router.get("/:id", authMiddleware, categoriesController.getOne);
router.put("/", authMiddleware, categoriesController.update);
router.delete("/:id", authMiddleware, categoriesController.delete);

module.exports = router;
