const sgMail = require("@sendgrid/mail"),
  User = require("../models/user"),
  LeaveTypes = require("../models/leave-types"),
  Leaves = require("../models/leaves"),
  dateFormat = require("dateformat"),
  mongoose = require("mongoose"),
  Config = require("../config/config");

sgMail.setApiKey(Config.sendgrid_api_key);

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const processLeaveDate = (leaveType, userInfo, req, callback) => {
  let data = {};
  if (req.body.leave_type_id == 1 || req.body.leave_type_id == 3) {
    if (req.body.duration === "Full Day") {
      let no_of_days = req.body.day_differ * 9.5 * 60;
      let balance = checkLeaveBalance(userInfo[leaveType], no_of_days);
      data.no_of_days_taken = req.body.day_differ;
      data.time_taken = "09:30";
      data.calculated_time = 0;
      data.balance = balance;
      return data;
    } else if (req.body.duration === "Half Day") {
      let time_taken = 285;
      data.calculated_time = 4.45;
      let balance = checkLeaveBalance(userInfo[leaveType], time_taken);
      data.shift = req.body.shift;
      data.specific_time = 4.45;
      data.no_of_days_taken = 0;
      data.balance = balance;
      if (req.body.shift == "Morning") {
        data.time_taken = getTimeDiff(
          req.body.start_date,
          req.body.end_date,
          "09:00",
          "13:45"
        );
      } else {
        data.time_taken = getTimeDiff(
          req.body.start_date,
          req.body.end_date,
          "13:45",
          "18:30"
        );
      }
      return data;
    } else if (req.body.duration === "Specify Time") {
      let hours = Math.abs(req.body.specific_time);
      let mins = (hours - Math.floor(hours)).toFixed(2);
      let sum = mins * 100;
      let time_taken = Math.floor(hours) * 60 + sum;
      let balance = checkLeaveBalance(userInfo[leaveType], time_taken);
      // data.no_of_days_taken=(userInfo[leaveType]-balance).toFixed(2);
      data.time_taken = getTimeDiff(
        req.body.start_date,
        req.body.end_date,
        req.body.start_time,
        req.body.end_time
      );
      data.no_of_days_taken = 0;
      data.calculated_time = req.body.specific_time;
      data.balance = balance;
      return data;
    } else {
      let balance =
        userInfo[leaveType] - (req.body.day_differ - req.body.week_days);
      data.no_of_days_taken = req.body.day_differ - req.body.week_days;
      data.balance = balance;
      data.time_taken = "09:30";
      data.duration = "Full Day";
      data.calculated_time = 0;
      return data;
    }
  } else {
    data.no_of_days_taken = req.body.day_differ;
    data.balance = 0;
    return data;
  }
};

exports.newLeave = async (req, res, next) => {
  try {
    var endDate = new Date(req.body.end_date);
    endDate.setDate(endDate.getDate() + 1);

    let getUserInfo = await User.findById({ _id: req.body.userId }).select(
      "_id email leave_balance first_name last_name optional_holidays camp_off assigneeId assignee marternity_leave paternity_leave work_form_home"
    );

    let LeaveData = {
      leaveId: req.body.leaveId,
      leave_desc: req.body.leave_desc,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      duration: req.body.duration,
      userId: req.body.userId,
      assigneeId: getUserInfo.assigneeId,
      createdBy: req.body.userId,
      start: req.body.start_date,
      end: req.body.end_date,
      status: "Pending",
    };

    let leaveType =
      req.body.leave_type_id == 1
        ? "leave_balance"
        : req.body.leave_type_id == 2
        ? "camp_off"
        : req.body.leave_type_id == 3
        ? "optional_holidays"
        : req.body.leave_type_id == 4
        ? "marternity_leave"
        : req.body.leave_type_id == 5
        ? "paternity_leave"
        : "work_form_home";

    let process = processLeaveDate(leaveType, getUserInfo, req);

    if (process) {
      if (process.balance > 0) {
        console.log("> balance");
        getUserInfo[leaveType] = process.balance;
        LeaveData.no_of_days_taken = process.no_of_days_taken;
        LeaveData.time_taken = process.time_taken;
        LeaveData.calculated_time = process.calculated_time;
      } else {
        console.log("< balance");
        getUserInfo[leaveType] = 0;
        LeaveData.no_of_days_taken = process.no_of_days_taken;
        LeaveData.los_of_pay_days = process.balance;
        LeaveData.duration = process.duration;
        LeaveData.time_taken = process.time_taken;
        LeaveData.calculated_time = process.calculated_time;
      }
      if (req.body.start_time || req.body.end_time) {
        LeaveData.start_time = req.body.start_time;
        LeaveData.end_time = req.body.end_time;
      }

      if (LeaveData.no_of_days_taken > 0) {
        LeaveData.title = `${getUserInfo.first_name} ${getUserInfo.last_name} (${LeaveData.no_of_days_taken} days.)`;
      } else {
        LeaveData.title = `${getUserInfo.first_name} ${getUserInfo.last_name} (${LeaveData.time_taken})`;
      }
      var newLeave = new Leaves(LeaveData);

      await newLeave.save();
      await getUserInfo.save();

      const msg = {
        to:
          getUserInfo.assignee && getUserInfo.assignee.email
            ? getUserInfo.assignee.email
            : "chowdary716@gmail.com",
        from: Config.sendgrid_email_acc,
        subject: `New Leave Applied By ${getUserInfo.first_name} ${getUserInfo.last_name}`,
        templateId: "d-ca6b0f87e9c3438a8b71205c6187f62d",
        substitutionWrappers: ["{{", "}}"],
        dynamic_template_data: {
          subject: `New Leave Applied By ${getUserInfo.first_name} ${getUserInfo.last_name}`,
          name:
            getUserInfo.assignee && getUserInfo.assignee.first_name
              ? getUserInfo.assignee.first_name
              : "ADMIN",
          emp_name: `${getUserInfo.first_name} ${getUserInfo.last_name}`,
          emp_email: getUserInfo.email,
          start_date: dateFormat(LeaveData.start_date, "fullDate"),
          end_date: dateFormat(LeaveData.end_date, "fullDate"),
          days: `${LeaveData.no_of_days_taken} , Duration: ${LeaveData.time_taken} (HH:MM)`,
        },
      };

      sgMail.send(msg);

      return res.status(200).json({
        status: true,
        message: "done!",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getLeaves = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const filter = req.query.filter;
    const userId = req.query.userId;
    let start_date = new Date(req.query.start_date),
      end_date = new Date(req.query.end_date);

    let where = {};

    if (filter) {
      where.status = filter;
    }
    where.createdAt = { $gte: start_date, $lte: end_date };
    where.userId = userId;

    let getLeaves = Leaves.find(where);
    if (pageSize && currentPage) {
      getLeaves
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }
    getLeaves.populate("leaveId");

    const findLeaves = await getLeaves;
    const leaveCount = await Leaves.countDocuments(where);

    return res.status(200).json({
      status: true,
      data: findLeaves,
      count: leaveCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.appliedLeaves = async (req, res, next) => {
  try {
    let start_date = new Date(req.query.start_date),
      end_date = new Date(req.query.end_date);

    let where = {};

    where.createdAt = { $gte: start_date, $lte: end_date };

    let getLeaves = Leaves.find(where)
      .sort({ createdAt: "desc" })
      .populate("leaveId")
      .populate("userId", "fitst_name last_name email");

    const appliedLeaves = await getLeaves;

    res.status(200).json({
      status: true,
      data: appliedLeaves,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllLeaves = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const filter = req.query.filter;
    let start_date = new Date(req.query.start_date),
      end_date = new Date(req.query.end_date);

    let where = {};

    if (filter) {
      where.status = filter;
    }

    where.createdAt = { $gte: start_date, $lte: end_date };

    let getLeaves = Leaves.find(where);
    if (pageSize && currentPage) {
      getLeaves
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    getLeaves.populate("leaveId");
    getLeaves.populate("userId", "email first_name last_name");

    const findLeaves = await getLeaves;
    const leaveCount = await Leaves.countDocuments(where);

    return res.status(200).json({
      status: true,
      data: findLeaves,
      count: leaveCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAssignedUserLeaves = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const filter = req.query.filter;

    let start_date = new Date(req.query.start_date),
      end_date = new Date(req.query.end_date);

    let where = {},
      getLeaves;

    where.createdAt = { $gte: start_date, $lte: end_date };
    where.assigneeId = req.params.id;

    if (req.query.userId) {
      where.userId = req.query.userId;
    }
    if (filter) {
      where.status = filter;
    }

    getLeaves = Leaves.find(where).populate("leaveId");
    if (pageSize && currentPage) {
      getLeaves
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const findLeaves = await getLeaves;
    const leaveCount = await Leaves.countDocuments(where);

    return res.status(200).json({
      status: true,
      data: findLeaves,
      count: leaveCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getLeaveById = async (req, res, next) => {
  try {
    const getLeave = await Leaves.findById({ _id: req.params.id });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getLeave,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getLeavesForCalendar = async (req, res, next) => {
  try {
    const start_date = new Date(req.query.start_date),
      end_date = new Date(req.query.end_date);

    let where = { status: { $nin: ["Canceled"] } };

    where.createdAt = { $gte: start_date, $lte: end_date };

    if (req.query.userId) {
      where.userId = req.query.userId;
    }

    const getLeaves = await Leaves.find(where).select("title start end");

    res.status(200).json({
      status: true,
      data: getLeaves,
    });
  } catch (err) {
    consoel.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateLeave = async (req, res, next) => {
  try {
    const date1 = new Date(req.body.start_date),
      date2 = new Date(req.body.end_date),
      diffDays = dayDifference(date1, date2);

    const leaveData = {
      _id: req.body.id,
      leaveId: req.body.leaveId,
      leave_desc: req.body.leave_desc,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      no_of_days_taken: diffDays,
      updatedBy: req.body.userId,
      userId: req.userId,
    };

    await Leaves.updateOne({ _id: req.params.id }, leaveData);

    return res.status(200).json({
      status: true,
      data: "Successfully Updated!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteLeave = async (req, res, next) => {
  try {
    await Leaves.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      status: true,
      data: "Successfully Deleted!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.cancelLeaveStatus = async (req, res, next) => {
  try {
    const getLeave = await Leaves.findById({ _id: req.params.id })
      .populate("leaveId")
      .populate(
        "userId",
        "_id leave_balance optional_holidays camp_off marternity_leave paternity_leave work_form_home"
      );

    const leave_type_id = getLeave.leaveId.leave_type_id;
    const leaveType =
      leave_type_id == 1
        ? "leave_balance"
        : leave_type_id == 2
        ? "camp_off"
        : leave_type_id == 3
        ? "optional_holidays"
        : leave_type_id == 4
        ? "marternity_leave"
        : leave_type_id == 5
        ? "paternity_leave"
        : "work_form_home";

    let balInc = 0;
    //INFO: issue with los of pay day and calculated time have to fix
    if (getLeave.los_of_pay_days >= 0 && getLeave.calculated_time <= 0) {
      console.log("+++++ve days");
      balInc = getLeave.no_of_days_taken - getLeave.los_of_pay_days;
    } else {
      if (getLeave.calculated_time > 0) {
        console.log("---ve time");
        let hours = Math.abs(getLeave.calculated_time);
        let mins = (hours - Math.floor(hours)).toFixed(2);
        let sum = mins * 100;
        let time_taken = Math.floor(hours) * 60 + sum;
        balInc = time_taken / 570;
        console.log(time_taken, sum, mins, hours, "#####", balInc);
        // balInc= ((getLeave.calculated_time)/(9.5));
      } else {
        balInc = getLeave.los_of_pay_days + getLeave.no_of_days_taken;
        console.log(
          balInc,
          "---ve days",
          getLeave.no_of_days_taken,
          getLeave.los_of_pay_days
        );
      }
    }
    // console.log(getLeave, balInc);

    const leaveData = {
      _id: req.params.id,
      status: "Canceled",
    };

    await Leaves.updateOne(
      { _id: req.params.id, userId: req.body.userId },
      leaveData
    );

    const userData = {
      _id: req.body.userId,
      updatedBy: req.userId,
    };

    userData[leaveType] =
      Number(getLeave.userId[leaveType]) + Number(balInc.toFixed(3));

    await User.updateOne({ _id: req.body.userId }, userData);

    return res.status(200).json({
      status: true,
      data: "Updated!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.approveLeaveStatus = async (req, res, next) => {
  try {
    if (req.role == 1 || req.role == 2) {
      const getLeave = await Leaves.findById({ _id: req.params.id }).populate(
        "userId",
        "email first_name last_name assignee"
      );
      const leaveData = {
        _id: req.params.id,
        status: "Approved",
        updatedBy: req.userId,
      };

      await Leaves.updateOne(
        { _id: req.params.id, userId: req.body.userId },
        leaveData
      );

      const msg = {
        to: getLeave.userId.email,
        from: Config.sendgrid_email_acc,
        subject: `Your Leave Approved by ${getLeave.userId.assignee.first_name}.`,
        templateId: "d-729ac87ab7ed4db79ce5127b6e360736",
        substitutionWrappers: ["{{", "}}"],
        dynamic_template_data: {
          subject: `Your Leave Approved.`,
          name: `${getLeave.userId.first_name}`,
          manager: getLeave.userId.assignee.first_name,
          status: "Approved",
          start_date: dateFormat(getLeave.start_date, "fullDate"),
          end_date: dateFormat(getLeave.end_date, "fullDate"),
          days: `${getLeave.no_of_days_taken} , Duration: ${getLeave.time_taken}`,
        },
      };
      sgMail.send(msg);

      return res.status(200).json({
        status: true,
        data: "Done!",
      });
    } else {
      res
        .status(401)
        .json({ status: false, message: "You are not authenticated!" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMonthlyLeaves = async (req, res, next) => {
  const d = new Date(),
    year = d.getFullYear(),
    start_date = new Date(`${year}/01/02`),
    end_date = new Date(`${year}/12/31`);

  let where = {};
  
  if (req.role != 1) {
    where["$match"] = {
      start_date: { $gte: start_date },
      end_date: { $lte: end_date },
      status: { $in: ["Pending", "Approved"] },
      userId: { $in: [mongoose.Types.ObjectId(req.userId)] },
    };
  } else {
    where["$match"] = {
      start_date: { $gte: start_date },
      status: { $in: ["Pending", "Approved"] },
      end_date: { $lte: end_date },
    };
  }

  let chartData = await Leaves.aggregate([
    where,
    {
      $group: {
        _id: { month: { $month: "$start_date" } },
        days: { $sum: "$no_of_days_taken" },
        time: { $sum: "$calculated_time" },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
  ]);
  //  time: { $sum: { $divide :['$calculated_time',9.3] } }
  if (chartData) {
    res.status(200).json({ status: true, data: chartData });
  }
};

//TODO : get Time differnece b/w two dates
exports.getWeekEnds = async (startDate, endDate) => {
  var date1 = new Date(startDate);
  var date2 = new Date(endDate);
  var weekendDays = 0;

  while (date1 <= date2) {
    var day = date1.getDay();
    if (day == 0 || day == 6) {
      weekendDays++;
    }
    date1 = new Date(+date1 + MILLISECONDS_PER_DAY);
  }
  return weekendDays;
};

//TODO : get Day difference b/w two dates
exports.getWeekEnds = (startDate, endDate, startTime, endTime) => {
  var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  var diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY) + 1;
  console.log(diffDays, "total days");
  return diffDays;
};

// TODO: get Time Difference
exports.getTimeDiff = async (startDate, endDate, startTime, endTime) => {
  var hrs, mins, timeDiff;
  let d = new Date(startDate);
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();

  var newDate = month + "/" + date + "/" + year;
  var date1 = new Date(newDate + " " + startTime).getTime();
  var date2 = new Date(newDate + " " + endTime).getTime();
  timeDiff = date2 - date1;
  mins = Math.floor(timeDiff / 60000);
  hrs = Math.floor(mins / 60);
  hrs = hrs < 10 ? "0" + hrs : "";
  mins = mins % 60;
  console.log(newDate, startTime, endTime, hrs, mins);
  return String(hrs + ":" + mins);
};

const checkLeaveBalance = async (balance, mins) => {
  console.log(balance, mins);
  var balance = balance * 9.5 * 60;
  var cal = (balance - mins) / 60;
  return cal / 9.5;
};
