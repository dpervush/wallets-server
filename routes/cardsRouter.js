const Router = require("express");
const cardsController = require("../controllers/cardsController");

const authMiddleware = require("../middlewares/authMiddleware.js");

const router = new Router();

router.post("/", authMiddleware, cardsController.create);
router.get("/", authMiddleware, cardsController.getAll);
router.get("/:id", authMiddleware, cardsController.getOne);
router.put("/", authMiddleware, cardsController.update);
router.delete("/:id", authMiddleware, cardsController.delete);

module.exports = router;
