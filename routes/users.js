const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const { validation } = require("../middlewares/validation");
const registerSchema = require("../validation/register.validation");
const loginSchema = require("../validation/login.validation");
const { auth, restrictTo } = require("../middlewares/auth");

router.get("/", auth, restrictTo("user") , usersControllers.getAllUsersDB);

router.post("/", validation(registerSchema), usersControllers.addUserDB);

router.delete("/:id",auth, usersControllers.deleteUserDB);

router.patch("/:id", auth, usersControllers.updateUserDB);

router.post("/login", validation(loginSchema), usersControllers.login);

router.get("/:userId/todos", auth, usersControllers.getTodosOfUser);

module.exports = router;
