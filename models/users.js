const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const usersSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
    },
    lastname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: [8, "username must be more than 8 in long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z]{3,}@(gmail|yahoo)\.com$/.test(v);
        },
        message: () => "invalid email",
      },
    },
    password: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date,
      required: false,
      min: "1950-01-01",
      max: "2015-01-01",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamp: true }
);

// next acts like a gate
usersSchema.pre("save", async function (next) {
  // console.log(this) // document that will be saved in DB
  let salt = await bcryptjs.genSalt(10);
  let hashedPassword = await bcryptjs.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});


const usersModel = mongoose.model("User", usersSchema);
module.exports = usersModel;
