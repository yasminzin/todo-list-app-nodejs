const joi = require("joi");

const todoSchema = joi.object({
  title: joi.string().trim().required().min(5).max(40),
  status: joi.string().valid("todo", "in progress", "done").default("todo"),
  userId: joi.string().length(24).hex()
});

module.exports = todoSchema
