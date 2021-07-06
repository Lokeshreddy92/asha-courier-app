const Education = require("../models/user-education");

exports.addEducation = async (req, res, next) => {
  try {
    const newEducation = new Education({
      level: req.body.level,
      institute: req.body.institute,
      specialization: req.body.specialization,
      score: req.body.score,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      createdBy: req.body.userId,
      updatedBy: req.body.userId,
      userId: req.body.userId,
    });

    await newEducation.save();

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

exports.getEducations = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let eduQuery,
      where = { userId: req.params.userid };

    if (search) {
      where.institute = { $regex: search, $options: "i" };
    }

    eduQuery = Education.find(where);

    if (pageSize && currentPage) {
      eduQuery
        .select("_id level institute specialization score start_date end_date")
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const education = await eduQuery;
    const eduCount = await Education.countDocuments();

    return res.status(200).json({
      status: true,
      data: education,
      count: eduCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getEducationById = async (req, res, next) => {
  try {
    const getEdu = await Education.find({ _id: req.params.id });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getEdu,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateEducation = async (req, res, next) => {
  try {
    const education = {
      _id: req.body.id,
      level: req.body.level,
      institute: req.body.institute,
      specialization: req.body.specialization,
      score: req.body.score,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      updatedBy: req.body.userId,
    };

    await Education.updateOne({ _id: req.params.id }, education);

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

exports.deleteEducation = async (req, res, next) => {
  try {
    await Education.deleteOne({ _id: req.params.id });

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
