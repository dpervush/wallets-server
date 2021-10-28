const { Sequelize } = require("sequelize");

const pool =
  process.env.NODE_ENV === "production"
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      })
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
