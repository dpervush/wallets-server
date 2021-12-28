const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  secondName: { type: DataTypes.STRING, allowNull: false },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.STRING }
});

const Account = sequelize.define("account", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const AccountCards = sequelize.define("account_cards", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const AccountCategories = sequelize.define("account_categories", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const AccountTransactions = sequelize.define("account_transactions", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const CardInfo = sequelize.define("card_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING },
  balance: { type: DataTypes.INTEGER, defaultValue: 0 },
  currency: { type: DataTypes.STRING, defaultValue: "RUB" },
  total: { type: DataTypes.BOOLEAN, defaultValue: true },
  icon: { type: DataTypes.STRING }
});

const CategoryInfo = sequelize.define("category_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  budget: { type: DataTypes.INTEGER },
  icon: { type: DataTypes.STRING }
});

const TransactionInfo = sequelize.define("transaction_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: Date.now }
});

// const TransactionCard = sequelize.define("transaction_card", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// });

// const TransactionCategory = sequelize.define("transaction_category", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// });

const Token = sequelize.define("token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.STRING, allowNull: false }
});

// user - account

User.hasOne(Token, {
  foreignKeyConstraint: true,
  onDelete: "cascade",
  hooks: true
});
Token.belongsTo(User);

User.hasOne(Account, {
  foreignKeyConstraint: true,
  onDelete: "cascade",
  hooks: true
});
Account.belongsTo(User);

Account.hasMany(AccountCards);
AccountCards.belongsTo(Account);

Account.hasMany(AccountCategories);
AccountCategories.belongsTo(Account);

Account.hasMany(AccountTransactions);
AccountTransactions.belongsTo(Account);

AccountCards.hasMany(AccountTransactions);
AccountTransactions.belongsTo(AccountCards);

AccountCategories.hasMany(AccountTransactions);
AccountTransactions.belongsTo(AccountCategories);

AccountCards.hasOne(CardInfo, {
  foreignKeyConstraint: true,
  onDelete: "cascade",
  hooks: true
});
CardInfo.belongsTo(AccountCards);

AccountCategories.hasOne(CategoryInfo, {
  foreignKeyConstraint: true,
  onDelete: "cascade",
  hooks: true
});
CategoryInfo.belongsTo(AccountCategories);

AccountTransactions.hasOne(TransactionInfo, {
  foreignKeyConstraint: true,
  onDelete: "cascade",
  hooks: true
});
TransactionInfo.belongsTo(AccountTransactions);

module.exports = {
  User,
  Token,
  Account,
  AccountCards,
  AccountCategories,
  AccountTransactions,
  CardInfo,
  CategoryInfo,
  TransactionInfo
};
