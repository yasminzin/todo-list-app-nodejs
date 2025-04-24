const joi = require("joi");

let loginSchema = joi.object({
  email: joi
    .string()
    .required()
    .pattern(new RegExp("^[a-zA-Z]{3,}@(gmail|yahoo).com$")),
  password: joi.string().required(),
});

module.exports = loginSchema;
