const express = require("express");
const TodoControllers = require("../controllers/todos");
const { auth, restrictTo } = require("../middlewares/auth");
const { validation } = require("../middlewares/validation");
const todoSchema = require("../validation/todo.validation");

// because app is not included in this file
// make router for every request
const router = express.Router();

// make sure that all routes you must be login first to access them
router.use(auth)

router.get("", restrictTo("user"), TodoControllers.getAllTodosDB);

router.post("", validation(todoSchema), TodoControllers.addTodoDB);

router.patch("/:id", TodoControllers.editTodoDB);

router.delete("/:id", TodoControllers.deleteTodoDB);

// apply auth only in this
// router.get("/:id/db", auth, TodoControllers.getTodoByIdDB);
router.get("/:id", TodoControllers.getTodoByIdDB);

module.exports = router;
