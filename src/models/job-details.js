const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const JobDetailsSchema = new Schema(
  {
    job_specification: {
      type: String,
      required: true,
    },
    employment_status: {
      type: String,
    },
    work_shift: {
      type: String,
    },
    job_location: {
      type: String,
    },
    status: {
      type: String,
      default: "Active",
    },
    join_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Jobs",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobDetails", JobDetailsSchema);
