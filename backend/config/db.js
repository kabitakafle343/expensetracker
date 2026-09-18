const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongodb successfully");
  } catch (error) {
    console.log("error while connecting db", error);
  }
};
