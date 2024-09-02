// server/index.js
require("dotenv").config();

const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const router = require("./Routers/index");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use('/api', router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    
    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
