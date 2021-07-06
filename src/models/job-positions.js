const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    job_name: {
      type: String,
      required: true,
    },
    job_desc: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jobs", jobSchema);
