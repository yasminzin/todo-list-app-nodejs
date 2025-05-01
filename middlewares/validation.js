exports.validation = (schema) => {
  return (req, res, next) => {
    // this object contains value object and error object
    // value object : values entered
    // error object : errors of validation
    // abortEarly : false >> validation will not print only the first error (print all errors)
    // error.details >> array of details of every error (object)
    let validationObject = schema.validate(
      req.body,
      // { ...req.body, ...req.params },
      {
        abortEarly: false,
      }
    );
    //   console.log(`validationObject : ${validationObject}`);
    //   console.log(`validationObject.error : ${validationObject.error}`);
    //   console.log(`validationObject.details : ${validationObject.error.details}`);
    if (validationObject.error) {
      return res
        .status(422)
        .json({ status: "fail", message: validationObject.error.details });
    } else {
      // call next to go to controller
      next();
    }
  };
};
