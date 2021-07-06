const Projects = require("../models/projects"),
  Tasks = require("../models/tasks");

exports.addTask = async (req, res, next) => {
  try {
    const newTask = new Tasks({
      task_name: req.body.task_name,
      task_desc: req.body.task_desc,
      tags: req.body.tags,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      assignedUsers: req.body.assignedUsers,
      createdBy: req.body.userId,
      status: "To Do",
      projectId: req.body.projectId,
      ticketId: req.body.ticketId,
      userId: req.body.userId,
    });

    await newTask.save();
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

exports.getTasks = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let Query;

    if (search) {
      Query = Tasks.find({ task_name: { $regex: search, $options: "i" } });
    } else {
      Query = Tasks.find();
    }

    Query.select("_id task_name assignedUsers userId createdAt status");
    //  .populate('userId', 'first_name last_name')

    if (pageSize && currentPage) {
      Query.skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const tasks = await Query;
    const count = await Tasks.countDocuments();

    return res.status(200).json({
      status: true,
      data: tasks,
      count: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const task = {
      _id: req.params.id,
      updatedBy: req.body.userId,
      starred: req.body.starred,
      task_priority: req.body.task_priority,
      status: req.body.status,
      updatedAt: new Date(),
    };
    await Tasks.updateOne({ _id: req.params.id }, task);

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

exports.moveTask = async (req, res, next) => {
  try {
    const task = {
      _id: req.params.id,
      updatedBy: req.body.userId,
      ticketId: req.body.ticketId,
      updatedAt: new Date(),
    };
    await Tasks.updateOne({ _id: req.params.id }, task);

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

exports.getTaskById = async (req, res, next) => {
  try {
    const getTasks = await Tasks.find({ _id: req.params.id });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getTasks,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTaskByTicketId = async (req, res, next) => {
  try {
    let filter = req.query.filter;
    let where = { ticketId: req.params.ticketId };

    if (req.query.userId) {
      where["assignedUsers._id"] = req.query.userId;
    }
    if (filter && filter == "Starred") {
      where.starred = true;
    }
    if (filter && filter == "Priority") {
      where.task_priority = true;
    }
    if (filter && filter == "Sheduled") {
      where.end_date = { $gte: new Date() };
    }
    if (filter && filter == "Today") {
      let d = new Date();
      var newDate = new Date(
        d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()
      );
      console.log(newDate, "task today", req.query.date);
      where.end_date = newDate;
    }
    if (filter && filter == "Done") {
      where.status = filter;
    }
    if (filter && filter == "Deleted") {
      where.status = filter;
    }
    if (req.query.tage) {
      where["tags.name"] = req.query.tage;
    }

    const getTasksComments = await Tasks.find(where)
      .populate("projectId", "assignedUsers")
      .sort({ createdAt: "desc" });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getTasksComments,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTaskTages = async (req, res, next) => {
  try {
    const pid = req.params.pid;

    const backend = await Tasks.countDocuments({
      projectId: pid,
      "tags.name": "Backend",
    });

    const frontend = await Tasks.countDocuments({
      projectId: pid,
      "tags.name": "Frontend",
    });

    const issue = await Tasks.countDocuments({
      projectId: pid,
      "tags.name": "Issue",
    });

    const mobile = await Tasks.countDocuments({
      projectId: pid,
      "tags.name": "Mobile",
    });

    const future = await Tasks.countDocuments({
      projectId: pid,
      "tags.name": "Future",
    });

    const other = await Tasks.countDocuments({
      projectId: pid,
      "tags.name": "Other",
    });

    const api = await Tasks.countDocuments({
      projectId: pid,
      "tags.name": "API",
    });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: [frontend, backend, api, issue, mobile, future, other],
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDashboardData = async (req, res, next) => {
  let projects,
    completed,
    starred,
    priority,
    sheduled,
    today,
    total,
    where = {};

  if (req.role != 1) {
    where["assignedUsers._id"] = req.userId;
    projects = await Projects.countDocuments({
      "assignedUsers._id": req.userId,
    });
    total = await Tasks.countDocuments({ "assignedUsers._id": req.userId });
    completed = await Tasks.countDocuments({
      "assignedUsers._id": req.userId,
      status: "Done",
    });
    starred = await Tasks.countDocuments({
      "assignedUsers._id": req.userId,
      starred: true,
    });
    priority = await Tasks.countDocuments({
      "assignedUsers._id": req.userId,
      task_priority: true,
    });
    sheduled = await Tasks.countDocuments({
      "assignedUsers._id": req.userId,
      end_date: { $gte: new Date() },
    });
    today = await Tasks.countDocuments({
      "assignedUsers._id": req.userId,
      status: { $in: ["To Do"] },
    });
  } else {
    projects = await Projects.countDocuments({});
    total = await Tasks.countDocuments({});
    completed = await Tasks.countDocuments({ status: "Done" });
    starred = await Tasks.countDocuments({ starred: true });
    priority = await Tasks.countDocuments({ task_priority: true });
    sheduled = await Tasks.countDocuments({ end_date: { $gte: new Date() } });
    today = await Tasks.countDocuments({ end_date: new Date() });
  }
  return res.status(200).json({
    status: true,
    data: {
      projects,
      total,
      completed,
      starred,
      priority,
      sheduled,
      today,
    },
  });
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = {
      _id: req.body._id,
      task_name: req.body.task_name,
      task_desc: req.body.task_desc,
      tags: req.body.tags,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      assignedUsers: req.body.assignedUsers,
      createdBy: req.body.userId,
      projectId: req.body.projectId,
      ticketId: req.body.ticketId,
      userId: req.body.userId,
    };

    await Tasks.updateOne({ _id: req.params.id }, task);

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

exports.deleteTask = async (req, res, next) => {
  try {
    await Tasks.deleteOne({ _id: req.params.id });

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
