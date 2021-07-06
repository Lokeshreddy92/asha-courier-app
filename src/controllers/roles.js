const Role = require("../models/roles");

exports.addRoles = async (req, res, next) => {
  try {
    var findRole = await Role.findOne({ role_name: req.body.role_name });
    if (findRole) {
      return res.status(405).json({
        message: "Role Name Alreday Exists!",
      });
    }

    const role = new Role({
      role_name: req.body.role_name,
      role_desc: req.body.role_desc,
    });

    await role.save();

    res.status(200).json({
      status: true,
      message: "Successfully Created!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;

    if (search) {
      roleQuery = Role.find({ role_name: { $regex: search, $options: "i" } });
    } else {
      roleQuery = Role.find();
    }
    if (pageSize && currentPage) {
      roleQuery
        .select("_id role_name role_desc createdAt role_id")
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    const role = await roleQuery;
    const roleCount = await Role.countDocuments();

    return res.status(200).json({
      status: true,
      data: role,
      count: roleCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const roleDoc = await Role.find({ _id: req.params.id });

    return res.status(200).json({
      message: "Role fetched successfully!",
      role: roleDoc,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateRoles = async (req, res, next) => {
  try {
    const role = {
      _id: req.body.id,
      role_id: req.body.role_id,
      role_name: req.body.role_name,
      role_desc: req.body.role_desc,
    };

    await Role.updateOne({ _id: req.params.id }, role);

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

exports.deleteRoles = async (req, res, next) => {
  try {
    await Role.deleteOne({ _id: req.params.id });
    
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
