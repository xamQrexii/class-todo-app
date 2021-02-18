const express = require("express");

const { userControllers } = require("../controllers");

const app = express();
const router = express.Router();

router.post("/signin", userControllers.signin);
router.post("/signup", userControllers.signUpUser);

exports.userRouter = app.use("/user", router);
