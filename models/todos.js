const mongoose = require("mongoose");

// object contains fields
const todosSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      minLength: 5,
      maxLength: 40,
    },
    status: {
      type: String,
      enum: ["todo", "in progress", "done"],
      default: "todo",
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamp: true }
);

// model
const todoModel = mongoose.model("Todo", todosSchema);

module.exports = todoModel;
