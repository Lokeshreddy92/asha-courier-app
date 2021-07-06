const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const commentsSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    file_url: {
      type: String,
    },
    fileType: {
      type: String,
    },
    status: {
      type: String,
      default: "Active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Tickets",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentsSchema);
