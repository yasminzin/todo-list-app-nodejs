const express = require("express");
const TodoControllers = require("../controllers/todos");
const { auth, blockRoles } = require("../middlewares/auth");
const { validation } = require("../middlewares/validation");
const todoSchema = require("../validation/todo.validation");

// because app is not included in this file
// make router for every request
const router = express.Router();

// make sure that all routes you must be login first to access them
router.use(auth);

router.get("", blockRoles("user"), TodoControllers.getAllTodos);

router.post(
  "",
  validation(todoSchema.createTodoSchema),
  TodoControllers.addTodo
);

router.patch(
  "/:id",
  validation(todoSchema.updateTodoSchema),
  TodoControllers.editTodo
);

router.delete("/:id", TodoControllers.deleteTodo);

// apply auth only in this
// router.get("/:id/db", auth, TodoControllers.getTodoByIdDB);
router.get("/:id", TodoControllers.getTodoById);

module.exports = router;
