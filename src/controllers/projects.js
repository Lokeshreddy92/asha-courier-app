const Projects = require("../models/projects");

exports.addProject = async (req, res, next) => {
  try {
    const newProject = new Projects({
      project_name: req.body.project_name,
      project_desc: req.body.project_desc,
      assignedUsers: req.body.assignedUsers,
      createdBy: req.body.userId,
      updatedBy: req.body.userId,
      status: "Active",
      userId: req.body.userId,
    });

    await newProject.save();

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

exports.getProjects = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let Query,
      where = {};

    if (search) {
      where.project_name = { $regex: search, $options: "i" };
    }
    if (req.role == 1) {
      //  where.userId=req.userId;
    } else {
      where["assignedUsers._id"] = req.userId;
    }
    Query = Projects.find(where);

    if (pageSize && currentPage) {
      Query.select("_id project_name project_desc createdAt")
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    var project = await Query;
    let count = await Projects.countDocuments();

    return res.status(200).json({
      status: true,
      data: project,
      count: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const getProduct = await Projects.find({ _id: req.params.id })
      .populate("userId", "_id email first_name last_name")
      .populate("updatedBy", "_id email first_name last_name");

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getProduct,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = {
      _id: req.body.id,
      project_name: req.body.project_name,
      project_desc: req.body.project_desc,
      updatedBy: req.body.userId,
      updatedAt: new Date(),
      assignedUsers: req.body.assignedUsers,
      status: req.body.status,
      userId: req.body.userId,
    };
    await Projects.updateOne({ _id: req.params.id }, project);

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

exports.deleteProject = async (req, res, next) => {
  try {
    await Projects.deleteOne({ _id: req.params.id });

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
