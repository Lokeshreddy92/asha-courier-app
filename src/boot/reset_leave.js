const User = require("../models/user"),
  LeaveTypes = require("../models/leave-types"),
  Leaves = require("../models/leaves"),
  dateFormat = require("dateformat"),
  mongoose = require("mongoose"),
  Config = require("../config/config"),
  cron = require("node-cron");

module.exports = async function () {
  cron.schedule(
    "59 23 31 12 *",
    async function () {
      try {
        let getUsers = await User.find({ status: "Active" }).select(
          "_id email leave_balance first_name last_name optional_holidays camp_off assigneeId assignee marternity_leave paternity_leave work_form_home"
        );
        if (getUsers) {
          updateUser(getUsers, function (err, data) {
            if (!err) {
              console.log("done!", data);
            } else {
              return;
            }
          });
        } else {
          return;
        }
      } catch (err) {
        console.log(err, "err");
      }
      console.log("running a task every minute");
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

var updateUser = function (users, callback) {
  Promise.all(
    users.map((user) => {
      if (user.leave_balance >= 10) {
        user.paid_leave = user.leave_balance - 10;
        user.leave_balance = 10 + Config.yearly_leave;
      } else {
        user.leave_balance = user.leave_balance + Config.yearly_leave;
        user.paid_leave = 0;
      }
      user.optional_holidays = Config.optional_holidays;
      return new Promise(function (resolve, reject) {
        User.updateOne({ _id: user._id }, user).then(function (err, data) {
          console.log("yearly leves done.......................!");
          resolve("done");
        });
      });
    })
  )
    .then((done) => {
      callback(null, "Successfully dpne!");
    })
    .catch((err) => {
      console.log("errrrr", err);
      callback(err, "Error Updating User Leave!");
    });
};
