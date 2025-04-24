const userModel = require("../models/users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/catchAsync");
const todoModel = require("../models/todos");
const AppError = require("../utils/appError");

exports.getAllUsersDB = catchAsync(async (req, res ,next) => {
  const users = await userModel.find();
  if (users.length === 0) {
    return next(new AppError(404, "No users found"));
  }
  res.status(200).json({ stauts: "success", message: users });
});

exports.addUserDB = catchAsync(async (req, res, next) => {
  const user = await userModel.create(req.body);
  res.status(201).json({ status: "success", data: user });
});

exports.deleteUserDB = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (id != req.id && req.role == "user") {
    return next(new AppError(403, "you can't perform this action"));
  }
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    return next(new AppError(404, "user not found"));
  }
  res
    .status(200)
    .json({ status: "success", message: "user deleted successfully" });
});

exports.updateUserDB = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedDocument = req.body;
  if (id != req.id && req.role == "user") {
    return next(new AppError(403, "you can't perform this action"));
  }
  const updatedUser = await userModel.findOneAndUpdate(
    { _id: id },
    updatedDocument,
    { new: true, runValidators: true }
  );
  if (!updatedUser) {
    return next(new AppError(404, "user not found"));
  }
  return res
    .status(200)
    .json({ status: "success", message: "user updated successfully", data: updatedDocument });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(400, "you must provide email and password to login")
    );
  }
  let user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError(401, "invalid email or password"));
  }
  // boolean
  let isValid = await bcryptjs.compare(password, user.password);
  if (!isValid) {
    return next(new AppError(401, "invalid email or password"));
  }
  // 3 things : 2 is necessary
  // 1st : payload >> information about user
  // 2nd : secret >> we use it to generate token signature and to verify token (must no one know it) >> for developer
  // put it in environment variable
  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
  res.status(200).json({
    status: "success",
    message: { token },
  });
});

exports.getTodosOfUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (userId != req.id && req.role == "user") {
    return next(new AppError(403, "you can't perform this action"));
  }
  const todos = await todoModel.find({ userId });
  if (todos.length == 0) {
    return next(new AppError(404, "user has no todos"));
  }
  res.status(200).json({
    status: "success",
    message: todos,
  });
});
