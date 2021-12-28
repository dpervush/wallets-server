// const sequelize = require("sequelize");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = require("../db");

const {
  AccountTransactions,
  TransactionInfo,
  CardInfo,
  CategoryInfo,
  AccountCards,
  AccountCategories
} = require("../models");

const getWeek = (date) => {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  const result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);

  return result;
};

class StatsService {
  async getAll(accountId) {
    const transactions = await AccountTransactions.findAll({
      attributes: ["id", "accountCardId", "accountCategoryId"],
      where: { accountId },
      include: [
        {
          model: TransactionInfo,
          required: true,
          attributes: {
            exclude: ["createdAt", "updatedAt", "accountTransactionId"]
          }
        }
      ]
    });

    return transactions;
  }

  // async getByCard(accountId) {
  //   const transactions = await AccountTransactions.findAll({
  //     where: { accountId },
  //     include: [
  //       {
  //         model: TransactionInfo,
  //         required: true,
  //         attributes: [],
  //       },
  //     ],
  //     attributes: [
  //       "accountCardId",
  //       [
  //         sequelize.fn("sum", sequelize.col("transaction_info.amount")),
  //         "total",
  //       ],
  //     ],
  //     group: ["accountId", "accountCardId"],
  //     raw: true,
  //   });

  //   return transactions;
  // }

  // async getByCard() {
  //   const users = await sequelize.query(
  //     `SELECT "account_transactions"."id", "transaction_info"."amount", "transaction_info"."title", "transaction_info"."date",
  //   cardColor as "cardColor", cardName as "cardName",
  //   categoryColor, categoryTitle, categoryBudget
  // FROM "account_transactions" AS "account_transactions"
  // INNER JOIN "transaction_infos" AS "transaction_info"
  // ON "account_transactions"."id" = "transaction_info"."accountTransactionId"
  // INNER JOIN "account_cards" AS "account_cards"
  // ON "account_cards"."id" = "account_transactions"."accountCardId"
  // INNER JOIN (
  //   select color as cardColor, name as cardName, "accountCardId"
  //   from card_infos
  // ) as "card_infos" ON ("account_transactions"."accountCardId" = "card_infos"."accountCardId")
  // INNER JOIN "account_categories" AS "account_categories"
  // ON "account_categories"."id" = "account_transactions"."accountCategoryId"
  // INNER JOIN (
  //   select color as categoryColor, title as categoryTitle, budget as categoryBudget, "accountCategoryId"
  //   from category_infos
  // ) as "category_infos" ON ("account_transactions"."accountCategoryId" = "category_infos"."accountCategoryId")
  // WHERE "account_transactions"."accountId" = '1'
  // ORDER BY "transaction_info"."date";`,
  //     {
  //       type: QueryTypes.SELECT,
  //     }
  //   );
  //   return users;
  // }

  // async getByCategory(accountId) {
  //   const transactions = await AccountTransactions.findAll({
  //     where: { accountId },
  //     include: [
  //       {
  //         model: TransactionInfo,
  //         required: true,
  //         attributes: [],
  //       },
  //     ],
  //     attributes: [
  //       "accountCategoryId",
  //       [
  //         sequelize.fn("sum", sequelize.col("transaction_info.amount")),
  //         "total",
  //       ],
  //     ],
  //     group: ["accountId", "accountCategoryId"],
  //     raw: true,
  //   });

  //   return transactions;
  // }

  async getByYear(accountId) {
    const transactions = await new StatsService()
      .getAll(accountId)
      .then((transactions) => {
        return transactions.reduce((acc, current) => {
          const year = new Date(current.transaction_info.date).getFullYear();

          if (!Object.prototype.hasOwnProperty.call(acc, year)) {
            acc[year] = { income: 0, expense: 0 };
          }
          if (current.transaction_info.type.toLowerCase() === "income") {
            acc[year].income += current.transaction_info.amount;
          } else {
            acc[year].expense += current.transaction_info.amount;
          }

          return acc;
        }, {});
      });

    return transactions;
  }

  async getByMonth(accountId) {
    const transactions = await new StatsService()
      .getAll(accountId)
      .then((transactions) => {
        return transactions.reduce((acc, current) => {
          const year = new Date(current.transaction_info.date).getFullYear();
          const month = new Date(current.transaction_info.date).getMonth();

          // if (!Object.prototype.hasOwnProperty.call(acc, year)) {
          //   acc[year] = {};
          // }
          // if (!Object.prototype.hasOwnProperty.call(acc[year], month)) {
          //   acc[year][month] = { income: 0, expense: 0 };
          // }

          // if (current.transaction_info.type.toLowerCase() === "income") {
          //   acc[year][month].income += current.transaction_info.amount;
          // } else {
          //   acc[year][month].expense += current.transaction_info.amount;
          // }

          if (!Object.prototype.hasOwnProperty.call(acc, year)) {
            acc[year] = {};
          }
          if (!Object.prototype.hasOwnProperty.call(acc[year], month)) {
            acc[year][month] = { income: 0, expense: 0 };
          }

          if (current.transaction_info.type.toLowerCase() === "income") {
            acc[year][month].income += current.transaction_info.amount;
          } else {
            acc[year][month].expense += current.transaction_info.amount;
          }

          return acc;
        }, {});
      });

    return transactions;
  }

  async getByWeek(accountId) {
    const transactions = await new StatsService()
      .getAll(accountId)
      .then((transactions) => {
        return transactions.reduce((acc, current) => {
          const year = new Date(current.transaction_info.date).getFullYear();
          const week = getWeek(new Date(current.transaction_info.date));

          if (!Object.prototype.hasOwnProperty.call(acc, year)) {
            acc[year] = {};
          }
          if (!Object.prototype.hasOwnProperty.call(acc[year], week)) {
            acc[year][week] = { income: 0, expense: 0 };
          }

          if (current.transaction_info.type.toLowerCase() === "income") {
            acc[year][week].income += current.transaction_info.amount;
          } else {
            acc[year][week].expense += current.transaction_info.amount;
          }

          return acc;
        }, {});
      });

    return transactions;
  }

  async getByCategory(accountId) {
    const [categories, meta] = await sequelize.query(`
      SELECT account_categories.id, category_infos.type, tbc.year, tbc.month, tbc2.sum, title, color, budget, icon
      FROM account_categories as account_categories
      inner join category_infos as category_infos 
      on account_categories.id = category_infos."accountCategoryId"
          
      cross join (
        select extract (year from date) as year, extract (month from date) as month
        from account_transactions
        inner join transaction_infos
        on account_transactions.id = transaction_infos."accountTransactionId"
          
        inner join account_categories
        on account_categories.id = account_transactions."accountCategoryId"
          
        where account_transactions."accountId" = ${accountId}
        group by year, month
      ) as tbc
    
      left join (
            select account_categories.id, sum(amount), extract (year from date) as year, extract (month from date) as month
          from account_transactions
          inner join transaction_infos
          on account_transactions.id = transaction_infos."accountTransactionId"
          
          inner join account_categories
          on account_categories.id = account_transactions."accountCategoryId"
          
          where account_transactions."accountId" = ${accountId}
          group by account_categories.id, year, month
          ) as tbc2
          on account_categories.id = tbc2."id" and tbc.month=tbc2.month
      order by tbc.year, tbc.month`);

    return categories;
  }

  async getByCard(accountId) {
    const [cards, meta] = await sequelize.query(`
        SELECT account_cards.id, name, color, total, balance,
        COALESCE((select sum(amount)
        from account_transactions
        inner join transaction_infos
        on account_transactions.id = transaction_infos."accountTransactionId"
      
        where account_transactions."accountId" = ${accountId} and transaction_infos.type = 'expense' and account_cards.id=account_transactions."accountCardId"
        group by account_cards.id
      ), 0) as expenses,
      COALESCE((select sum(amount)
        from account_transactions
        inner join transaction_infos
        on account_transactions.id = transaction_infos."accountTransactionId"
      
        where account_transactions."accountId" = ${accountId} and transaction_infos.type = 'income' and account_cards.id=account_transactions."accountCardId"
        group by account_cards.id
      ), 0) as incomes
      FROM account_cards as account_cards
      inner join card_infos as card_infos
      on account_cards.id = card_infos."accountCardId"
      where account_cards."accountId" = ${accountId}`);

    return cards;
  }
}

module.exports = new StatsService();

// SELECT ПО ТРАНЗАКЦИЯМИ С КАРТАМИ И КАТЕГОРИЯМИ

// SELECT "account_transactions"."id", "transaction_info"."amount", "transaction_info"."title", "transaction_info"."date",
// 	cardColor as "cardColor", cardName as "cardName",
// 	categoryColor, categoryTitle, categoryBudget
// FROM "account_transactions" AS "account_transactions"
// INNER JOIN "transaction_infos" AS "transaction_info"
// ON "account_transactions"."id" = "transaction_info"."accountTransactionId"
// INNER JOIN "account_cards" AS "account_cards"
// ON "account_cards"."id" = "account_transactions"."accountCardId"
// INNER JOIN (
// 	select color as cardColor, name as cardName, "accountCardId"
// 	from card_infos
// ) as "card_infos" ON ("account_transactions"."accountCardId" = "card_infos"."accountCardId")
// INNER JOIN "account_categories" AS "account_categories"
// ON "account_categories"."id" = "account_transactions"."accountCategoryId"
// INNER JOIN (
// 	select color as categoryColor, title as categoryTitle, budget as categoryBudget, "accountCategoryId"
// 	from category_infos
// ) as "category_infos" ON ("account_transactions"."accountCategoryId" = "category_infos"."accountCategoryId")
// WHERE "account_transactions"."accountId" = '1'
// ORDER BY "transaction_info"."date";

//
//
//
// SELECT account_categories.id, title, color, budget,
// 	( select sum(amount)
// 	from account_transactions
// 	inner join transaction_infos
// 	on account_transactions.id = transaction_infos."accountTransactionId"
// 	where account_transactions."accountId" = 1 and "account_categories"."id" = "account_transactions"."accountCategoryId") as amount
// FROM account_categories as account_categories
// inner join category_infos as category_infos
// on account_categories.id = category_infos."accountCategoryId"

//

//
//

// вывод статы котегорий
// SELECT account_categories.id, title, color, budget, tbc.sum, tbc.year, tbc.month
//       FROM account_categories as account_categories
//       inner join category_infos as category_infos
//       on account_categories.id = category_infos."accountCategoryId"

//       inner join (
//         select account_categories.id, sum(amount), extract (year from date) as year, extract (month from date) as month
//       from account_transactions
//       inner join transaction_infos
//       on account_transactions.id = transaction_infos."accountTransactionId"

//       inner join account_categories
//       on account_categories.id = account_transactions."accountCategoryId"

//       where account_transactions."accountId" = ${accountId} and transaction_infos.type = 'Expense'
//       group by account_categories.id, year, month
//       ) as tbc
//       on account_categories.id = tbc."id"
//       order by tbc.year, tbc.month
