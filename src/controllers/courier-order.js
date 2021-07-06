const CourierOrder = require("../models/courier-order");

exports.addOrder = async (req, res, next) => {
  try {
    var newOrder = new CourierOrder({
      name: req.body.name,
      desc: req.body.desc,
      type: req.body.type,
      branch: req.body.branch,
      from: req.body.from,
      to: req.body.to,
      amount: req.body.amount,
      qty: req.body.qty,
      eamil: req.body.email,
      mobile: req.body.mobile,
      location: req.body.location,
      customerId: req.body.customerId,
      createdBy: req.userId,
      updatedBy: req.userId,
      status: "Confirmed",
      userId: req.userId,
    });

    const save = await newOrder.save();

    return res.status(200).json({
      status: true,
      data: save,
      message: "done!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const orderIds = req.query.orderIds;
    const filter = req.query.filter;
    let start_date = new Date(req.query.start_date),
      end_date = new Date(req.query.end_date);

    let Query,
      where = {};

    if (filter) {
      where.status = filter;
    }

    where.createdAt = { $gte: start_date, $lte: end_date };

    if (orderIds) {
      where.orderId = { $in: orderIds.split(",") };
    }
    if (req.role === 4) {
      where.customerId = req.userId;
    }
    Query = CourierOrder.find(where);

    if (pageSize && currentPage) {
      Query.select(
        "_id name desc type orderId from branch email amount qty mobile to status location updatedAt createdAt"
      )
        .populate("customerId", "_id email first_name last_name")
        .populate("updatedBy", "_id email first_name last_name")
        .populate("createdBy", "_id email first_name last_name")
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    var orders = await Query;
    let count = await CourierOrder.countDocuments();

    return res.status(200).json({
      status: true,
      data: orders,
      count: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.trackOrders = async (req, res, next) => {
  try {
    const orderIds = req.query.orderIds;
    const filter = req.query.filter;
    let start_date, end_date;

    if (req.query.start_date && req.query.end_date) {
      start_date = new Date(req.query.start_date);
      end_date = new Date(req.query.end_date);
    }

    let Query,
      where = {};

    if (filter) {
      where.status = filter;
    }

    if (orderIds) {
      where.orderId = { $in: orderIds.split(",") };
    }

    Query = CourierOrder.find(where);

    Query.select(
      `_id name desc type orderId from branch amount qty mobile to status location updatedAt createdAt email shipped_date delivered_date `
    )
      .populate("customerId", "_id email first_name last_name")
      .populate("updatedBy", "_id email first_name last_name")
      .populate("createdBy", "_id email first_name last_name")
      .sort({ createdAt: "desc" }).exec;

    var orders = await Query;

    return res.status(200).json({
      status: true,
      orders,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const getOrder = await CourierOrder.find({ _id: req.params.id })
      .populate("userId", "_id email first_name last_name")
      .populate("customerId", "_id email first_name last_name")
      .populate("updatedBy", "_id email first_name last_name");

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getOrder,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = {
      _id: req.body._id,
      name: req.body.name,
      desc: req.body.desc,
      type: req.body.type,
      branch: req.body.branch,
      customerId: req.body.customerId._id,
      form: req.body.from,
      to: req.body.to,
      location: req.body.location,
      updatedBy: req.userId,
      updatedAt: new Date(),
      userId: req.userId,
    };
    await CourierOrder.updateOne({ _id: req.params.id }, order);

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

exports.updateOrderStatus = async (req, res, next) => {
  try {
    let order = {
      _id: req.body.id,
      status: req.body.status,
    };

    if (req.body.status === "Shipped") order.shipped_date = new Date();

    if (req.body.status === "Delivered") order.delivered_date = new Date();

    if (req.body.status === "Faild to Ship") order.shipped_date = new Date();

    if (req.body.status === "Failed to Deliver")
      order.delivered_date = new Date();

    await CourierOrder.updateOne({ _id: req.params.id }, order);

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

exports.deleteOrder = async (req, res, next) => {
  try {
    await CourierOrder.deleteOne({ _id: req.params.id });

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

exports.getCourierDashboardData = async (req, res, next) => {
  if (req.role === 1 || req.role === 2 || req.role === 3 || req.role == 4) {
    const newDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    let totalOrders,
      readyToShip,
      readToDeliver,
      shipped,
      devlivered,
      faildToShip,
      faildToDeliver,
      todayShipping,
      todayDeliver;

    let where = {};
    if (req.role === 4) {
      where.customerId = req.userId;
    }

    totalOrders = await CourierOrder.countDocuments(where);

    where.status = { $in: ["Confirmed"] };
    readyToShip = await CourierOrder.countDocuments(where);

    where.status = { $in: ["Shipped"] };
    shipped = await CourierOrder.countDocuments(where);

    where.status = { $in: ["Out for Delivery"] };
    readToDeliver = await CourierOrder.countDocuments(where);

    where.status = { $in: ["Delivered"] };
    devlivered = await CourierOrder.countDocuments(where);

    where.status = { $in: ["Faild to Ship"] };
    faildToShip = await CourierOrder.countDocuments(where);

    where.status = { $in: ["Faild to Deliver"] };
    faildToDeliver = await CourierOrder.countDocuments(where);

    where.status = { $in: ["Confirmed"] };
    where.shipped_date = { $gt: newDate };
    todayShipping = await CourierOrder.countDocuments(where);

    where.status = { $in: ["Delivered"] };
    where.shipped_date = { $gt: newDate };
    todayDeliver = await CourierOrder.countDocuments(where);

    return res.status(200).json({
      status: true,
      data: {
        totalOrders,
        shipped,
        readyToShip,
        devlivered,
        faildToShip,
        faildToDeliver,
        todayShipping,
        todayDeliver,
        readToDeliver,
      },
    });
  } else {
    return res
      .status(401)
      .json({ status: false, message: "You are not authenticated!" });
  }
};
