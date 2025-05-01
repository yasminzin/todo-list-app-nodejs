const todoModel = require("../models/todos");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllTodos = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const todos = await todoModel
    .find()
    .populate("userId")
    .skip(skip)
    .limit(limit);
  if (todos.length === 0) {
    return next(new AppError(404, "No todos found"));
  }
  const todosCount = await todoModel.countDocuments();
  return res.status(200).json({
    status: "success",
    results: todos.length,
    totalPages: Math.ceil(todosCount / limit),
    currentPage: page,
    data: todos,
  });
});

exports.addTodo = catchAsync(async (req, res) => {
  let newTodo = req.body;
  // validation middleware
  let todo = await todoModel.create({ ...newTodo, userId: req.id });
  res.status(201).json({ status: "success", data: todo });
});

exports.getTodoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await todoModel.findById(id).populate("userId");
  if (!todo) {
    return next(new AppError(404, "todo not found"));
  }
  if (todo.userId._id.toString() !== req.id && req.role == "user") {
    return next(new AppError(403, "you can't perform this action"));
  }
  res.status(200).json({ status: "success", message: todo });
});

exports.editTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await todoModel.findById(id).populate("userId");
  if (!todo) {
    return next(new AppError(404, "todo not found"));
  }
  if (todo.userId._id.toString() !== req.id && req.role == "user") {
    return next(new AppError(403, "you can't perform this action"));
  }

  todo.title = req.body.title || todo.title;
  todo.status = req.body.status ? req.body.status : todo.status;

  await todo.save();
  res.status(200).json({
    status: "success",
    message: "todo updated successfully",
  });
});

exports.deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await todoModel.findById(id).populate("userId");
  if (!todo) {
    return next(new AppError(404, "todo not found"));
  }
  if (todo.userId._id.toString() !== req.id && req.role == "user") {
    return next(new AppError(403, "you can't perform this action"));
  }
  await todo.deleteOne();
  res
    .status(200)
    .json({ status: "success", message: "todo deleted successfully" });
});
