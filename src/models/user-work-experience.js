const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const WorkSchema = new Schema(
  {
    company_name: {
      type: String,
      required: true,
    },
    job_title: {
      type: String,
      required: true,
    },
    work_desc: {
      type: String,
    },
    projects: {
      type: Array,
      default: [],
    },
    team_size: {
      type: Number,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workexperience", WorkSchema);
