const Category = require("../models/categories");

exports.addCategory = async (req, res, next) => {
  try {
    const newCategory = new Category({
      category_name: req.body.category_name,
      category_desc: req.body.category_desc,
      userId: req.userId,
    });

    await newCategory.save();

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

exports.getCategories = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let categoryQuery;

    if (search) {
      categoryQuery = Category.find({
        category_name: { $regex: search, $options: "i" },
      });
    } else {
      categoryQuery = Category.find();
    }

    if (pageSize && currentPage) {
      categoryQuery
        .select("_id category_name category_desc createdAt")
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const category = await categoryQuery;
    const categoryCount = await Category.countDocuments();

    return res.status(200).json({
      status: true,
      data: category,
      count: categoryCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const getCategory = await Category.find({ _id: req.params.id });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getCategory,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = {
      _id: req.body.id,
      category_name: req.body.category_name,
      category_desc: req.body.category_desc,
      userId: req.body.userId,
    };
    await Category.updateOne({ _id: req.params.id }, category);

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

exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.deleteOne({ _id: req.params.id });

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
