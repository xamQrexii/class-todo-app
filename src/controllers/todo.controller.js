const ObjectId = require("mongoose").Types.ObjectId;

const { TodoModel } = require("../models");

exports.getTodos = async (req, res) => {
  const { id } = req.user;

  try {
    const todos = await TodoModel.find({ createdBy: id });
    if (todos.length < 1) {
      return res.send({
        success: true,
        message: "You have not created any task yet",
      });
    }

    return res.send({ success: true, todos });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.createTodo = async (req, res) => {
  const { title, description, isCompleted } = req.body;

  try {
    const todo = await TodoModel.create({
      title,
      description,
      createdBy: req.user.id,
      isCompleted,
    });
    todo.save();
    return res.send({
      success: true,
      message: "Todo created successfully",
      todo,
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

exports.updateTodoById = async (req, res) => {
  // const { title, description, isCompleted } = req.body;
  const { id } = req.params;

  const updateKeys = Object.keys(req.body);
  const allowedKeys = ["title", "description", "isCompleted"];
  const isValidKeys = updateKeys.every((key) => allowedKeys.includes(key));

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Please provide valid todo ID" });
  }

  if (updateKeys.length < 1) {
    return res
      .status(400)
      .json({ success: false, message: "Fields required in body" });
  }

  if (!isValidKeys) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid API Keys" });
  }

  try {
    const updateTodo = await TodoModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateTodo) {
      return res
        .status(404)
        .send({ success: false, message: "Task not found" });
    }

    return res.send({ success: true, updateTodo });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

exports.deleteTodoById = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Please provide valid todo ID" });
  }
  try {
    const deletedTask = await TodoModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res
        .status(400)
        .send({ success: false, message: "Task not found" });
    }
    return res.send({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
