const joi = require("joi");

let baseUserSchema = joi.object({
  firstname: joi.string().min(3).max(15),
  lastname: joi.string().min(3).max(15),
  username: joi.string().min(8),
  email: joi.string().pattern(new RegExp("^[a-zA-Z]{3,}@(gmail|yahoo).com$")),
  password: joi.string(),
  birthdate: joi.date().min("1950-01-01").max("2015-01-01"),
  role: joi.string().valid("user", "admin").default("user"),
});

const createUserSchema = baseUserSchema.fork(
  ["firstname", "lastname", "username", "email", "password"],
  (schema) => schema.required()
);

const updateUserSchema = baseUserSchema.min(1);

module.exports = {
  createUserSchema,
  updateUserSchema,
};
