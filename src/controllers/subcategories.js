const SubCategory = require("../models/subcategories");

exports.addSubCategory = async (req, res, next) => {
  try {
    const newCategory = new SubCategory({
      sub_category_name: req.body.sub_category_name,
      sub_category_desc: req.body.sub_category_desc,
      categoryId: req.body.categoryId,
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

exports.getSubCategories = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    let subcategoryQuery;

    if (search) {
      subcategoryQuery = SubCategory.find({
        sub_category_name: { $regex: search, $options: "i" },
      }).populate("categoryId", "category_name");
    } else {
      subcategoryQuery = SubCategory.find().populate(
        "categoryId",
        "category_name"
      );
    }

    if (pageSize && currentPage) {
      subcategoryQuery
        .select("_id sub_category_name categoryId sub_category_desc createdAt")
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const subcategory = await subcategoryQuery;
    const categoryCount = await SubCategory.countDocuments();

    return res.status(200).json({
      status: true,
      data: subcategory,
      count: categoryCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSubCategoryById = async (req, res, next) => {
  try {
    const getCategory = await SubCategory.find({ _id: req.params.id }).populate(
      "categoryId",
      "category_name"
    );

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

exports.getCategoriesById = async (req, res, next) => {
  try {
    const getCategory = await SubCategory.find({
      categoryId: req.params.catId,
    });

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

exports.updateSubCategory = async (req, res, next) => {
  try {
    const category = {
      _id: req.body.id,
      sub_category_name: req.body.sub_category_name,
      sub_category_desc: req.body.sub_category_desc,
      categoryId: req.body.categoryId,
      userId: req.userId,
    };

    await SubCategory.updateOne({ _id: req.params.id }, category);

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

exports.deleteSubCategory = async (req, res, next) => {
  try {
    await SubCategory.deleteOne({ _id: req.params.id });
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
