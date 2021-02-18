const mongoose = require("mongoose");

const { Config } = require("../config");

exports.connectDatabase = async () => {
  try {
    await mongoose.connect(Config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB connected successfully!`);
  } catch (error) {
    console.log(`Unable to connect database: ${error.message}`);
  }
};
