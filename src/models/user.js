const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  AutoIncrement = require("mongoose-increment")(mongoose);

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    personal_email: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
    },
    github: {
      type: String,
    },
    facebook: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    twitter: {
      type: String,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: "Male",
    },
    marital_status: {
      type: String,
    },
    married_date: {
      type: Date,
    },
    nationality: {
      type: String,
      default: "Indain",
    },
    aadhar_ID: {
      type: String,
    },
    pan_ID: {
      type: String,
    },
    profile_img: {
      type: String,
    },
    mobile: {
      type: Number,
      required: true,
    },
    paid_leave: {
      type: Number,
      default: 0,
    },
    leave_balance: {
      type: Number,
      default: 0,
    },
    optional_holidays: {
      type: Number,
      default: 2,
    },
    camp_off: {
      type: Number,
      default: 0,
    },
    marternity_leave: {
      type: Number,
      default: 0,
    },
    paternity_leave: {
      type: Number,
      default: 0,
    },
    work_form_home: {
      type: Number,
      default: 0,
    },
    date_of_birth: {
      type: Date,
    },
    join_date: {
      type: Date,
    },
    skills: {
      type: Array,
      default: [],
    },
    role: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    password_update: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Inactive",
    },
    email_varify: {
      type: Boolean,
      default: false,
    },
    reset_password_token: {
      type: String,
    },
    reset_password_expires: {
      type: Date,
    },
    login_ip: {
      type: String,
    },
    login_date: {
      type: Date,
    },
    assignee: {
      type: Object,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    jobDetailsId: {
      type: Schema.Types.ObjectId,
      ref: "JobDetails",
    },
    userAddressId: {
      type: Schema.Types.ObjectId,
      ref: "UserAddress",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

userSchema.plugin(AutoIncrement, {
  type: String,
  unique: true,
  modelName: "userSchema",
  fieldName: "emp_ID",
  start: 01,
  prefix: "E0",
});

module.exports = mongoose.model("User", userSchema);
