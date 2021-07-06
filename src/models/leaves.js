const mongoose = require("mongoose"),
  Schema = mongoose.Schema;


const leaveSchema = new Schema(
  {
    leaveId: {
      type: Schema.Types.ObjectId,
      ref: "LeaveTypes",
      required: true,
    },
    leave_desc: {
      type: String,
    },
    no_of_days_taken: {
      type: Number,
      required: true,
    },
    los_of_pay_days: {
      type: Number,
      default: 0,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    title: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    duration: {
      type: String,
      default: "Full Day",
    },
    calculated_time: {
      type: Number,
      required: true,
      default: 0,
    },
    shift: {
      type: String,
    },
    start_time: {
      type: String,
    },
    end_time: {
      type: String,
    },
    time_taken: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leaves", leaveSchema);
