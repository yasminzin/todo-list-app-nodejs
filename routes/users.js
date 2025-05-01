const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const { validation } = require("../middlewares/validation");
const registerSchema = require("../validation/register.validation");
const loginSchema = require("../validation/login.validation");
const { auth, blockRoles } = require("../middlewares/auth");

router.get("/", auth, blockRoles("user"), usersControllers.getAllUsers);

router.post(
  "/",
  validation(registerSchema.createUserSchema),
  usersControllers.addUser
);

router.delete("/:id", auth, usersControllers.deleteUser);

router.patch(
  "/:id",
  auth,
  validation(registerSchema.updateUserSchema),
  usersControllers.updateUser
);

router.post("/login", validation(loginSchema), usersControllers.login);

router.get("/:userId/todos", auth, usersControllers.getTodosOfUser);

module.exports = router;
