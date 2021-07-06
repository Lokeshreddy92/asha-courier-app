const AccessToken = require("../models/access-tokens");

exports.addToken = async (req, res, next) => {
  try {
    const newToken = new AccessToken({
      token: req.body.token,
      userId: req.body.userId,
    });

    await newToken.save();

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

exports.getTokens = async (req, res, next) => {
  try {
    const TokenQuery = await AccessToken.find();
    const TokenCount = await AccessToken.countDocuments();

    return res.status(200).json({
      status: true,
      data: TokenQuery,
      count: TokenCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTokenById = async (req, res, next) => {
  try {
    const getToken = await AccessToken.find({ _id: req.params.id });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getToken,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateToken = async (req, res, next) => {
  try {
    const token = {
      _id: req.body.id,
      token: req.body.token,
      userId: req.body.userId,
    };
    await AccessToken.updateOne({ _id: req.params.id }, token);

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

exports.deleteToken = async (req, res, next) => {
  try {
    await AccessToken.deleteOne({ _id: req.params.id });

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
