const _ = require("lodash"),
  fs = require("fs"),
  sgMail = require("@sendgrid/mail"),
  User = require("../models/user"),
  Projects = require("../models/projects"),
  Comments = require("../models/comments"),
  Config = require("../config/config"),
  dateFormat = require("dateformat");

sgMail.setApiKey(Config.sendgrid_api_key);

exports.addComment = async (req, res, next) => {
  try {
    const newTicket = new Comments({
      comment: req.body.comment,
      createdBy: req.body.userId,
      status: "Active",
      projectId: req.body.projectId,
      ticketId: req.body.ticketId,
      userId: req.body.userId,
    });

    if (req.file || req.file != undefined) {
      newTicket.file_url = req.file.filename;
      newTicket.fileType = req.body.fileType.toLowerCase();
    }

    const saveComment = await newTicket.save();

    const projectData = await Projects.find({ _id: req.body.projectId }).select(
      `_id project_name assignedUsers`
    );

    const userDetail = await User.find({ _id: req.body.userId }).select(
      `_id email first_name last_name`
    );

    const msg = {
      to: _.flatten(projectData[0].assignedUsers, "email"),
      from: Config.sendgrid_email_acc,
      subject: `New Comment on Project ${projectData[0].project_name}`,
      templateId: "d-9c6c2af6d73e4aff80508d58d68989be",
      substitutionWrappers: ["{{", "}}"],
      dynamic_template_data: {
        subject: `New Comment on Project ${projectData[0].project_name}`,
        user: userDetail[0].first_name,
        project: `${projectData[0].project_name}`,
        comment_name: saveComment.comment,
        date: dateFormat(new Date(), "fullDate"),
      },
    };

    sgMail.send(msg);
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

exports.getComments = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let Query;
    
    if (search) {
      Query = Comments.find({ ticket_name: { $regex: search, $options: "i" } });
    } else {
      Query = Comments.find();
    }
    Query.select("_id comment file_url fileType createdAt status")
      .populate("projectId", "project_name userId createdBy status")
      .populate("ticketId", "ticket_name userId createdBy status");

    if (pageSize && currentPage) {
      Query.skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const comments = await Query;
    const count = await Comments.countDocuments();

    return res.status(200).json({
      status: true,
      data: comments,
      count: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCommentById = async (req, res, next) => {
  try {
    const getComment = await Comments.find({ _id: req.params.id })
      .populate("projectId", "project_name userId createdBy status")
      .populate("ticketId", "ticket_name userId createdBy status");

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getComment,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCommentByTicketId = async (req, res, next) => {
  try {
    const getTicketComments = await Comments.find({
      ticketId: req.params.ticketId,
    })
      .populate("userId", "first_name last_name")
      .sort({ createdAt: "desc" });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getTicketComments,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const comment = {
      _id: req.body.id,
      comment: req.body.comment,
      file_url: req.body.file_url,
      updatedBy: req.body.userId,
      status: req.body.status,
      projectId: req.body.projectId,
      ticketId: req.body.ticketId,
      userId: req.body.userId,
    };
    await Comments.updateOne({ _id: req.params.id }, comment);

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

exports.deleteFile = async (req, res, next) => {
  try {
    fs.unlinkSync("./uploads/" + req.body.file_url);

    const comment = { _id: req.body.id, file_url: "", fileType: "" };

    await Comments.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      status: true,
      data: "File Deleted!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    await Comments.deleteOne({ _id: req.params.id });

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
