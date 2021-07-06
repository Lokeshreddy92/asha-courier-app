const jwt = require("jsonwebtoken"),
  { deafult: Config } = require("../config/config");

module.exports = (req, res, next) => {
  try {
    const jwtSecret = process.env.JWT || Config.jwt;

    const authHeader = req.get("Authorization");
    if (!authHeader) {
      req.isAuth = false;
      return next();
    }

    let decodedToken;
    const token = authHeader.split(" ")[1];

    decodedToken = jwt.verify(token, jwtSecret);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    req.userId = decodedToken.jwtData.userId;
    if (decodedToken.jwtData.role) req.role = decodedToken.jwtData.role;
    req.name = decodedToken.jwtData.name;
    req.email = decodedToken.jwtData.email;
    req.isAuth = true;

    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};
