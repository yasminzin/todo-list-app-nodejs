const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

exports.auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    // return res.status(401).json({
    //   status: "fail",
    //   message: "please login first"
    // })
    return next(new AppError(401, "please login first"));
  }
  //   return decoded (payload)
  //   if it's not verified it will throw error
  let payload = jwt.verify(authorization, process.env.SECRET);
  console.log(payload);
  // use id found in payload in addTodoDB to add userId to the saved todo
  req.id = payload.id;
  req.role = payload.role;
  req.user = { id: payload.id, role: payload.role };
  next();
};

// for authorization to know if the action can be taken or will be rejected
// using return (req, res, next) because we have parameters sent to the function
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.role)) {
      return next(
        new AppError(403, "you don't have permission to perform this action")
      );
    }
    next();
  };
};
