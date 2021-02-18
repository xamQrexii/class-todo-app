const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

const { UserModel } = require("../models");
const { Config } = require("../config");

exports.signUpUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ success: false, message: "Username and password required" });
  }

  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res
        .status(409)
        .send({ success: false, message: "User already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const createUser = await UserModel.create({
      username,
      password: hashPassword,
    });

    createUser.save();
    return res.send({
      success: true,
      username: createUser.username,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ success: false, message: "Username and password required" });
  }
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide valid password" });
    }

    const payload = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(payload, Config.JWT_SECRET, {
      expiresIn: "4h",
    });

    return res.send({
      success: true,
      message: "Successfully log in",
      token,
      id: user._id,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
