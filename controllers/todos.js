const todoModel = require("../models/todos");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllTodosDB = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  const todos = await todoModel.find().populate("userId");
  if (todos.length === 0) {
    return next(new AppError(404, "No todos found"));
  }
  if (limit && skip) {
    let newTodos = todos.slice(skip, skip + limit);
    return res.status(200).json({ status: "success", data: newTodos });
  } else {
    let newTodos = todos.slice(0, 10);
    return res.status(200).json({ status: "success", data: newTodos });
  }
  // res.status(200).json({ status: "success", data: todos });
});

exports.addTodoDB = catchAsync(async (req, res) => {
  let newTodo = req.body;
  // validation middleware
  let todo = await todoModel.create({ ...newTodo, userId: req.id });
  res.status(201).json({ status: "success", data: todo });
});

exports.getTodoByIdDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (id != req.id && req.role == "user") {
      return next(new AppError(403, "you can't perform this action"));
    }
  let todo = await todoModel.findById(id);
  if (!todo) {
    return next(new AppError(404, "todo not found"));
  }
  res.status(200).json({ status: "success", message: todo });
});

exports.editTodoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedDocument = req.body;
  if (id != req.id && req.role == "user") {
    return next(new AppError(403, "you can't perform this action"));
  }
  const updatedTask = await todoModel.findOneAndUpdate(
    { _id: id },
    updatedDocument,
    { new: true, runValidators: true }
  );
  if (!updatedTask) {
    return next(new AppError(404, "todo not found"));
  }
  res.status(200).json({
    status: "success",
    message: "todo updated successfully",
  });
});

exports.deleteTodoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (id != req.id && req.role == "user") {
    return next(new AppError(403, "you can't perform this action"));
  }
  const todo = await todoModel.findByIdAndDelete(id);
  if (!todo) {
    return next(new AppError(404, "todo not found"));
  }
  res
    .status(200)
    .json({ status: "success", message: "todo deleted successfully" });
});
