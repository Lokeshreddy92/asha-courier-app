const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chats", userSchema);
