const jwt = require("jsonwebtoken");

const { UserModel } = require("../models");
const { Config } = require("../config");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(400)
      .send({ success: false, message: "Please provide valid token" });
  }

  try {
    const decoded = jwt.verify(token, Config.JWT_SECRET);
    const user = await UserModel.findById({ _id: decoded.id });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User does not exist" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error:", error.message);
    res.status(401).json({ message: "Token is not valid", success: false });
  }
};
