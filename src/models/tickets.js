const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    ticket_name: {
      type: String,
      required: true,
    },
    ticket_desc: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Open", "New", "To Do", "Closed", "Pending", "Inprogress", "Done"],
      default: "Open",
    },
    ticket_priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Hight",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tickets", ticketSchema);
