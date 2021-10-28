const Router = require("express");
const userRouter = require("./userRouter");
const cardsRouter = require("./cardsRouter");
const categoriesRouter = require("./categoriesRouter");
const transactionsRouter = require("./transactionsRouter");

const router = new Router();

router.use("/auth", userRouter);
router.use("/cards", cardsRouter);
router.use("/categories", categoriesRouter);
router.use("/transactions", transactionsRouter);

module.exports = router;
