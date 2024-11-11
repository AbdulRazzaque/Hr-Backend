const express = require("express");
const dotenv = require("dotenv");
const errorhandler = require("./middlewares/errorhandler");
const mongoose = require("mongoose");
const Route = require("./routes");
const path = require("path");

const cors = require('cors')
const app = express();
app.use(cors())
dotenv.config({
  path: "./config/.env",
});


global.appRoot= path.resolve(__dirname);
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use('/api',Route)
app.use('/uploads',express.static('uploads'))


mongoose
  .connect(process.env.BATA_BASE_CONNECTION, {})
  .then((response) => {
    console.log("Connection Successfully.");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(errorhandler);
app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
