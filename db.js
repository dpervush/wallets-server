const { Sequelize } = require("sequelize");

const pool =
  process.env.NODE_ENV === "production"
    ? new Sequelize(process.env.DATABASE_URL)
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          dialect: "postgres",
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
        }
      );

module.exports = pool;
