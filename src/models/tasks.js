const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    task_name: {
      type: String,
      required: true,
    },
    task_desc: {
      type: String,
    },
    assignedUsers: {
      type: Array,
      default: [],
    },
    tags: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      enum: ["To Do", "Starred", "Pending", "Deleted", "Done", "Priority"],
      default: "New",
    },
    task_priority: {
      type: String,
      type: Boolean,
      default: false,
    },
    starred: {
      type: String,
      type: Boolean,
      default: false,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
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

module.exports = mongoose.model("Tasks", TaskSchema);
