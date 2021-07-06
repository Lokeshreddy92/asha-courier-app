const Tickets = require("../models/tickets");

exports.addTicket = async (req, res, next) => {
  try {
    const d = new Date();

    const newTicket = new Tickets({
      ticket_name: req.body.ticket_name,
      ticket_desc: req.body.ticket_desc,
      createdBy: req.body.userId,
      updatedBy: req.body.userId,
      ticket_priority: req.body.ticket_priority,
      projectId: req.body.projectId,
      userId: req.body.userId,
    });

    await newTicket.save();

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

exports.getTickets = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let Query;

    if (search) {
      Query = Tickets.find({ ticket_name: { $regex: search, $options: "i" } });
    } else {
      Query = Tickets.find();
    }

    Query.select(
      "_id ticket_name ticket_priority ticket_desc createdAt updatedAt status"
    ).populate("projectId", "project_name userId createdBy status");

    if (pageSize && currentPage) {
      Query.skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const ticket = await Query;
    const count = await Tickets.countDocuments();

    return res.status(200).json({
      status: true,
      data: ticket,
      count: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTicketsByProjectId = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let Query,
      where = {};

    where.projectId = req.params.pid;

    if (search) {
      where.ticket_name = { $regex: search, $options: "i" };
    }

    Query = Tickets.find(where)
      .select(
        "_id ticket_name ticket_priority ticket_desc createdAt updatedAt status"
      )
      .populate("projectId", "project_name userId createdBy status");

    if (pageSize && currentPage) {
      Query.skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const ticket = await Query;
    const count = await Tickets.countDocuments(where);

    return res.status(200).json({
      status: true,
      data: ticket,
      count: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const getTicket = await Tickets.find({ _id: req.params.id })
      .populate(
        "projectId",
        "project_name assignedUsers userId createdBy status"
      )
      .populate("userId", "_id email first_name last_name")
      .populate("updatedBy", "_id email first_name last_name");

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getTicket,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const ticket = {
      _id: req.body.id,
      ticket_name: req.body.ticket_name,
      ticket_desc: req.body.ticket_desc,
      updatedBy: req.body.userId,
      updatedAt: new Date(),
      projectId: req.body.projectId,
      userId: req.body.userId,
    };

    await Tickets.updateOne({ _id: req.params.id }, ticket);

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

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = {
      _id: req.body.id,
      updatedBy: req.body.userId,
      ticket_priority: req.body.ticket_priority,
      status: req.body.status,
      updatedAt: new Date(),
    };

    await Tickets.updateOne({ _id: req.params.id }, ticket);

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

exports.deleteTicket = async (req, res, next) => {
  try {
    await Tickets.deleteOne({ _id: req.params.id });

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
