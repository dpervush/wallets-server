const {
  AccountTransactions,
  TransactionInfo,
  CardInfo,
  CategoryInfo,
  AccountCards,
  AccountCategories,
} = require("../models");

class TransactionService {
  async create({ title, type, amount, cardId, categoryId, accountId }) {
    const createdTransaction = await AccountTransactions.create({
      accountId,
      accountCardId: cardId,
      accountCategoryId: categoryId,
    });

    const transactionInfo = await TransactionInfo.create({
      title,
      amount,
      type,
      accountTransactionId: createdTransaction.id,
    });

    return { ...createdTransaction.dataValues, ...transactionInfo.dataValues };
  }

  async getAll(accountId) {
    // todo: check if might be deleted
    const transactionIds = await AccountTransactions.findAll({
      where: { accountId },
    });

    const transactions = await AccountTransactions.findAll({
      attributes: ["id"],
      where: { accountId },
      include: [
        {
          model: AccountCards,
          required: true,
          include: {
            model: CardInfo,
            required: true,
            attributes: {
              exclude: ["createdAt", "updatedAt", "accountCardId", "id"],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "accountId"],
          },
        },
        {
          model: AccountCategories,
          required: true,
          include: {
            model: CategoryInfo,
            required: true,
            attributes: {
              exclude: ["createdAt", "updatedAt", "accountCategoryId", "id"],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "accountId"],
          },
        },
        {
          model: TransactionInfo,
          required: true,
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "accountTransactionId"],
          },
        },
      ],
    });

    return transactions;
  }
  async getOne(id) {
    if (!id) {
      throw new Error("не указан ID");
    }
    const transaction = await AccountTransactions.findByPk(id, {
      include: [
        {
          model: AccountCards,
          required: true,
          include: {
            model: CardInfo,
            required: true,
            attributes: {
              exclude: ["createdAt", "updatedAt", "accountCardId", "id"],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "accountId"],
          },
        },
        {
          model: AccountCategories,
          required: true,
          include: {
            model: CategoryInfo,
            required: true,
            attributes: {
              exclude: ["createdAt", "updatedAt", "accountCategoryId", "id"],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "accountId"],
          },
        },
        {
          model: TransactionInfo,
          required: true,
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "accountTransactionId"],
          },
        },
      ],
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "accountId",
          "accountCardId",
          "accountCategoryId",
        ],
      },
    });
    return transaction;
  }

  async update({ id, title, amount, date, cardId, categoryId }) {
    if (!id) {
      throw new Error("не указан ID");
    }

    if (cardId) {
      await AccountTransactions.update(
        { accountCardId: cardId },
        { where: { id } }
      );
    }

    if (categoryId) {
      await AccountTransactions.update(
        { accountCategoryId: categoryId },
        { where: { id } }
      );
    }

    await TransactionInfo.update(
      { title, amount, date },
      {
        where: { accountTransactionId: id },
      }
    );

    const updatedCard = this.getOne(id);

    return updatedCard;
  }

  async delete(id) {
    if (!id) {
      throw new Error("не указан ID");
    }

    const transaction = await AccountTransactions.findOne({
      where: { id },
    });

    return await transaction
      .destroy()
      .then(() => "ok")
      .catch(() => "error");
  }
}

module.exports = new TransactionService();
