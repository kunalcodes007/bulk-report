const express = require("express");
const app = express();
const database = require("./config/database");

require("dotenv").config({ path: "./config/env" });
// const connectDB = require("./config/mongoConnect");
// const ErrorHandler = require("./Utils/ErrorHandler");
const respReport=require("./Controller/respReport")
const whatsappReport=require("./Controller/whatsappReport")
app.use(express.json());
// app.use(ErrorHandler)
app.use("/api",respReport)
app.use("/api",whatsappReport)
database();
const PORT = process.env.PORT;

// connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});


