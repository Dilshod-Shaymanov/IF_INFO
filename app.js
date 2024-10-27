const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const indexRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");
const error_handling_middleware = require("./middleware/error_handling_middleware");
require("dotenv").config({
  path:`.env.${process.env.NODE_ENV}`
});

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);

// console.log(config.get("secret"));

process.on("uncaughtException",(exception) => {
  console.log("uncaughtException: ", exception);
  // process.exit(1);
});
process.on("unhandledRejection", (reject) => {// pomiseda xatolik ni uchlab oladi
  console.log("UnhandledRejecttion: ",reject); 
});



const port = config.get("port") || 3030;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", indexRouter);
app.use(error_handling_middleware)


async function start() {
  try {
    await mongoose.connect(config.get("dbUrl"))
      .then(() => console.log("Connected MongoDb"));
    app.listen(port, () => {
      console.log(`Server running at port http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Connection with Mongodb Or Server`, error);
  }
}
start();
