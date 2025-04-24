const joi = require("joi");

let registerSchema = joi.object({
  firstname: joi.string().required().min(3).max(15),
  lastname: joi.string().required().min(3).max(15),
  username: joi.string().required().min(8),
    email: joi
    .string()
    .required()
    .pattern(new RegExp("^[a-zA-Z]{3,}@(gmail|yahoo).com$")),
  password: joi.string().required(),
  birthdate: joi.date().min("1950-01-01").max("2015-01-01"),
  role: joi.string().valid("user", "admin").default("user"),
});

module.exports = registerSchema;
