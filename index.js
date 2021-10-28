require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models");
const cors = require("cors");
const router = require("./routes");
// const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");

const PORT = process.env.PORT || 8080;

const app = express();

var whitelist = ["http://localhost:3000", "https://wallets-pt.vercel.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", router);

// Обработка ошибок
// app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();