const Config = require("../config/config"),
  jwt = require("jsonwebtoken"),
  AccessToken = require("../models/access-tokens");

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "You are not authenticated!" });
    }

    const checkToken = await AccessToken.findOne({ token: token });

    if (!checkToken) {
      return res
        .status(401)
        .json({ status: false, message: "You are not authenticated!" });
    }

    const decodedToken = await jwt.verify(token, Config.jwt);

    req.role = decodedToken.jwtData.role;
    req.userId = decodedToken.jwtData.userId;
    req.email = decodedToken.jwtData.email;
    req.isAuth = true;

    if (req.role !== 1) {
      return res
        .status(401)
        .json({ status: false, message: "You are not authenticated!" });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "You are not authenticated!",
    });
  }
};
