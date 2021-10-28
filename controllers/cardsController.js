const cardsService = require("../services/cardsService.js");
const getValueFromCookie = require("../utils/getValueFromCookie.js");

class CardController {
  async create(req, res) {
    const accountId = getValueFromCookie("accountId", req.headers.cookie);

    try {
      const { name, color, number, balance, currency, total } = req.body;
      const card = await cardsService.create({
        name,
        color,
        number,
        balance,
        currency,
        total,
        accountId,
      });
      res.json(card);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    const accountId = getValueFromCookie("accountId", req.headers.cookie);

    try {
      const cards = await cardsService.getAll(accountId);
      return res.json(cards);
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async getOne(req, res) {
    try {
      const card = await cardsService.getOne(req.params.id);
      return res.json(card);
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async update(req, res) {
    try {
      const updatedCard = await cardsService.update(req.body);
      return res.json(updatedCard);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
  async delete(req, res) {
    try {
      const card = await cardsService.delete(req.params.id);
      return res.json(card);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new CardController();
