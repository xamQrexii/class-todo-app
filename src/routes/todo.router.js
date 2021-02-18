const express = require("express");

const { todoControllers } = require("../controllers");
const { authMiddleware } = require("../middlewares");

const app = express();
const router = express.Router();

router.get("/", authMiddleware, todoControllers.getTodos);
router.post("/create", authMiddleware, todoControllers.createTodo);
router.put("/:id", authMiddleware, todoControllers.updateTodoById);
router.delete("/:id", authMiddleware, todoControllers.deleteTodoById);

exports.todoRouter = app.use("/todo", router);
