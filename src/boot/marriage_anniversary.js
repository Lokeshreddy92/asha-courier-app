const User = require("../models/user"),
  LeaveTypes = require("../models/leave-types"),
  Leaves = require("../models/leaves"),
  dateFormat = require("dateformat"),
  mongoose = require("mongoose"),
  _ = require("underscore"),
  Config = require("../config/config"),
  cron = require("node-cron");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Config.sendgrid_api_key);

module.exports = async function () {
  cron.schedule(
    "00 10 * * *",
    async function () {
      try {
        let date = new Date(),
          m = date.getMonth() + 1,
          d = date.getDate();
        let getUsers = await User.aggregate([
          {
            $project: {
              name: { $concat: ["$first_name", " ", "$last_name", " , "] },
              email: "$email",
              profile_img: "$profile_img",
              married_date: "$married_date",
              status: "$status",
              month: { $month: "$married_date" },
              day: { $dayOfMonth: "$married_date" },
            },
          },
          { $match: { status: "Active", month: m, day: d } },
        ]);
        console.log(getUsers, d, m, "---M anniversary");
        if (getUsers.length > 0) {
          let email = _.pluck(getUsers, "email");
          let names = _.pluck(getUsers, "name");
          console.log(email, names);
          const msg = {
            to: email,
            // bcc: names,,
            // cc: names,
            from: Config.sendgrid_email_acc,
            subject: `Happy Marriage Anniversary!`,
            templateId: "d-f83a302e489c4b8ba53cd4149aafe130",
            substitutionWrappers: ["{{", "}}"],
            dynamic_template_data: {
              subject: `Happy Marriage Anniversary!`,
              names: names,
              wish_type: `Happy Marriage Anniversary!`,
            },
          };
          sgMail.send(msg);
        } else {
          return;
        }
      } catch (err) {
        console.log(err, "err");
      }
      console.log("running a task every day");
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};
