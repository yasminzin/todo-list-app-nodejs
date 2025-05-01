const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");

const todosRoutes = require("./routes/todos");
const usersRoutes = require("./routes/users");

const todosModel = require("./models/todos");
const AppError = require("./utils/appError");

const app = express();

// custom middleware
// app.use((req, res, next) => {
//   console.log(req.url);
//   next(); // must write next function
// });

// define variables in .env in process.env
dotenv.config();

// console.log(process.env)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

// set the engine
app.set("view engine", "pug");

// write path folder of views
app.set("views", "./views");

// diskStorage gives you full control on storing files to disk
const storage = multer.diskStorage({
  // null means there's no error
  destination: function (req, file, cb) {
    // folder that will be uploaded to
    cd(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // control the file name that you will save
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "_" + file.originalname);
    // 'avatar-85943758943_iti.jpg'
  },
  // check on size and extension
  fileFilter: function (req, file, cb) {},
});

// multer return funciton and it takes the path that files will be uploaded to
// const upload = multer({ dest: 'uploads/'})

// equal storage object
const upload = multer({ storage: storage });

app.post("/profile", upload.single("avatar"), (req, res, next) => {
  console.log(req.file);
  res.send("file uploaded");
});

// endpoint
app.get("/todos/views", async (req, res) => {
  // name of file or view : 1st
  // data or object : 2nd
  let todos = await todosModel.find();
  res.render("todos", { todos });
});

// ready middleware
app.use(express.json());

// middleware for server static files
// write for folder that contains files eg. txt file, css files, images
app.use(express.static("./static"));
// access static files through localhost:3000/style.css or localhost:3000/img.png

// middleware of cors
app.use(cors()); // origin = *

// middlewares
// make two ways or two branches
// if the request come on /users go to usersRoutes
// if the request come on /todos go to todosRoutes
// in these files we will continue the path after /routes or /users
app.use("/todos", todosRoutes);
app.use("/users", usersRoutes);

// not found middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "route not found",
  });
  // next(new AppError(404, "route not found"));
});

// error handling middleware
app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ status: "fail", message: err.message || "try again later" });
});

// middleware must be written in order

// from specific origin
// app.use(cors({
//   origin : 'localhost:5173',
//   methods: "GET, POST, PUT"
// }))

// endpoint >> just for test
app.get("/hello", (req, res, next) => {
  res.send("Hello World");
});

const port = "3000";

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
