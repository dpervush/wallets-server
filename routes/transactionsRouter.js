const Router = require("express");
const transactionsController = require("../controllers/transactionsController");

const authMiddleware = require("../middlewares/authMiddleware.js");

const router = new Router();

router.post("/", authMiddleware, transactionsController.create);
router.get("/", authMiddleware, transactionsController.getAll);
router.get("/:id", authMiddleware, transactionsController.getOne);
router.put("/", authMiddleware, transactionsController.update);
router.delete("/:id", authMiddleware, transactionsController.delete);

module.exports = router;
