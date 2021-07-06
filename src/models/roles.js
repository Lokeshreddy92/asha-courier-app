const mongoose = require("mongoose"),
  AutoIncrement = require("mongoose-sequence")(mongoose),
  Schema = mongoose.Schema;
  
const roleSchema = new Schema(
  {
    role_name: {
      type: String,
      unique: true,
      required: true,
    },
    role_desc: {
      type: String,
      default: "I am new!",
      required: true,
    },
    role_id: {
      type: Number,
      index: { unique: true },
    },
  },
  { timestamps: true }
);

roleSchema.plugin(AutoIncrement, { inc_field: "role_id" });

module.exports = mongoose.model("Role", roleSchema);
