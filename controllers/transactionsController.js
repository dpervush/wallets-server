const transactionsService = require("../services/transactionsService.js");
const getValueFromCookie = require("../utils/getValueFromCookie.js");

class TransactionsController {
  async create(req, res) {
    const accountId = getValueFromCookie("accountId", req.headers.cookie);

    try {
      const { title, type, amount, date, cardId, categoryId } = req.body;
      const transaction = await transactionsService.create({
        title,
        type,
        amount,
        cardId,
        categoryId,
        accountId,
        date,
      });
      res.json(transaction);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    const accountId = getValueFromCookie("accountId", req.headers.cookie);

    try {
      const {
        card: cardId,
        category: categoryId,
        flow: type,
        page,
        size,
      } = req.query;
      const transactions = await transactionsService.getAll(
        accountId,
        cardId,
        categoryId,
        type,
        page,
        size
      );
      return res.json(transactions);
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async getOne(req, res) {
    try {
      const transaction = await transactionsService.getOne(req.params.id);
      return res.json(transaction);
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async getLast(req, res) {
    const accountId = getValueFromCookie("accountId", req.headers.cookie);

    try {
      const transactions = await transactionsService.getLast(accountId);
      return res.json(transactions);
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async update(req, res) {
    try {
      const { id, title, amount, type, date, cardId, categoryId } = req.body;

      const updatedTransaction = await transactionsService.update({
        id,
        title,
        amount,
        type,
        date,
        cardId,
        categoryId,
      });

      return res.json(updatedTransaction);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
  async delete(req, res) {
    try {
      const transaction = await transactionsService.delete(req.params.id);
      return res.json(transaction);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new TransactionsController();
