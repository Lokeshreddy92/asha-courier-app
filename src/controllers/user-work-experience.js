const WorkEx = require("../models/user-work-experience");

exports.addWorkEx = async (req, res, next) => {
  try {
    const newWork = new WorkEx({
      company_name: req.body.company_name,
      job_title: req.body.job_title,
      work_desc: req.body.work_desc,
      projects: req.body.projects,
      team_size: req.body.team_size,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      createdBy: req.body.userId,
      updatedBy: req.body.userId,
      userId: req.body.userId,
    });

    await newWork.save();

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

exports.getWorks = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let workQuery,
      where = { userId: req.params.userid };

    if (search) {
      where.company_name = { $regex: search, $options: "i" };
    }

    workQuery = WorkEx.find(where);

    if (pageSize && currentPage) {
      workQuery
        .select(
          "_id company_name job_title work_desc projects team_size start_date end_date createdAt"
        )
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const work = await workQuery;
    const workCount = await WorkEx.countDocuments();

    return res.status(200).json({
      status: true,
      data: work,
      count: workCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getWorkById = async (req, res, next) => {
  try {
    const getWork = await WorkEx.find({ _id: req.params.id });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getWork,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateWork = async (req, res, next) => {
  try {
    const work = {
      _id: req.body.id,
      company_name: req.body.company_name,
      job_title: req.body.job_title,
      work_desc: req.body.work_desc,
      projects: req.body.projects,
      team_size: req.body.team_size,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      updatedBy: req.body.userId,
    };

    await WorkEx.updateOne({ _id: req.params.id }, work);

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

exports.deleteWork = async (req, res, next) => {
  try {
    await WorkEx.deleteOne({ _id: req.params.id });
    
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
