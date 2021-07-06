const LeaveTypes = require("../models/leave-types");

exports.newLeaveType = async (req, res, next) => {
  try {
    const newLeave = new LeaveTypes({
      leave_type: req.body.leave_type,
      leave_desc: req.body.leave_desc,
      no_of_days: Number(req.body.no_of_days),
      any_validation: Boolean(req.body.any_validation),
      carry_forward: req.body.carry_forward,
      message: req.body.message,
      userId: req.userId,
    });

    await newLeave.save();

    return res.status(200).json({
      status: true,
      message: "done!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getLeaveTypes = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    const userId = req.query.userId;

    let leaveQuery;
    if (search) {
      leaveQuery = LeaveTypes.find({
        leave_type: { $regex: search, $options: "i" },
      });
    } else {
      leaveQuery = LeaveTypes.find();
    }

    if (pageSize && currentPage) {
      leaveQuery
        .select(
          "_id leave_type leave_desc carry_forward leave_type_id no_of_days createdAt"
        )
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const leave = await leaveQuery;
    const leaveCount = await LeaveTypes.countDocuments();

    return res.status(200).json({
      status: true,
      data: leave,
      count: leaveCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getLeaveTypeById = async (req, res, next) => {
  try {
    const getLeave = await LeaveTypes.find({ _id: req.params.id });

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

exports.updateLeaveType = async (req, res, next) => {
  try {
    let leave = {
      _id: req.body.id,
      leave_type: req.body.leave_type,
      leave_desc: req.body.leave_desc,
      no_of_days: Number(req.body.no_of_days),
      any_validation: Boolean(req.body.any_validation),
      carry_forward: req.body.carry_forward,
      message: req.body.message,
      userId: req.userId,
    };

    if (req.body.allowed_days) {
      leave.allowed_days = Number(req.body.allowed_days);
    }

    await LeaveTypes.updateOne({ _id: req.params.id }, leave);

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

exports.deleteLeaveType = async (req, res, next) => {
  try {
    await LeaveTypes.deleteOne({ _id: req.params.id });

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
