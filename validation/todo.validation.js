const joi = require("joi");

const baseTodoSchema = joi.object({
  title: joi.string().trim().min(5).max(40),
  status: joi.string().valid("todo", "in progress", "done").default("todo"),
  userId: joi.string().length(24).hex(),
});

const createTodoSchema = baseTodoSchema.fork(["title"], (schema) =>
  schema.required()
);

const updateTodoSchema = baseTodoSchema.min(1);

module.exports = {
  createTodoSchema,
  updateTodoSchema,
};
