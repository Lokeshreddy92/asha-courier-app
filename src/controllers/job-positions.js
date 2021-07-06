const Jobs = require("../models/job-positions");

exports.addJob = async (req, res, next) => {
  try {
    const newJobs = new Jobs({
      job_name: req.body.job_name,
      job_desc: req.body.job_desc,
      userId: req.userId,
    });

    await newJobs.save();

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

exports.getJobs = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let JobsQuery;

    if (search) {
      JobsQuery = Jobs.find({ job_name: { $regex: search, $options: "i" } });
    } else {
      JobsQuery = Jobs.find();
    }

    if (pageSize && currentPage) {
      JobsQuery.select("_id job_name job_desc createdAt")
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const findJobs = await JobsQuery;
    const Count = await Jobs.countDocuments();

    return res.status(200).json({
      status: true,
      data: findJobs,
      count: Count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const getJobs = await Jobs.find({ _id: req.params.id });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getJobs,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const updateJob = {
      _id: req.body.id,
      job_name: req.body.job_name,
      job_desc: req.body.job_desc,
      userId: req.body.userId,
    };
    await Jobs.updateOne({ _id: req.params.id }, updateJob);

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

exports.deleteJob = async (req, res, next) => {
  try {
    await Jobs.deleteOne({ _id: req.params.id });

    res.status(200).json({
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
