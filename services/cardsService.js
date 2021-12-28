const { AccountCards, CardInfo } = require("../models");

class CardService {
  async create({ name, color, balance, currency, total, icon, accountId }) {
    const createdCard = await AccountCards.create({
      accountId
    });

    const cardInfo = await CardInfo.create({
      name,
      color,
      balance,
      currency,
      total,
      icon,
      accountCardId: createdCard.id
    });

    return { ...createdCard.dataValues, ...cardInfo.dataValues };
  }

  async getAll(accountId) {
    // todo: check if might be deleted
    const cardIds = await AccountCards.findAll({ where: { accountId } });

    const cards = await AccountCards.findAll({
      attributes: ["id", "accountId"],
      where: { accountId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: CardInfo,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt", "accountCardId"] }
        }
      ]
    });

    return cards;
  }
  async getOne(id) {
    if (!id) {
      throw new Error("не указан ID");
    }
    const card = await AccountCards.findByPk(id, {
      include: [
        {
          model: CardInfo,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt", "accountCardId"] }
        }
      ]
    });
    return card;
  }

  async update(card) {
    if (!card.id) {
      throw new Error("не указан ID");
    }

    const updatedCard = await CardInfo.update(card, {
      where: { accountCardId: card.id },
      returning: true,
      attributes: { exclude: ["createdAt", "updatedAt", "accountCardId"] }
      // plain: true,
    }).then((result) => result[1][0]);

    return updatedCard;
  }

  async delete(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const card = await AccountCards.findOne({
      where: { id }
    });

    return await card
      .destroy()
      .then(() => "ok")
      .catch(() => "error");
  }
}

module.exports = new CardService();
