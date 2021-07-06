const bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  ChatUser = require("../models/chat-user"),
  validator = require("validator"),
  Config = require("../config/config");

exports.createChatUser = async (req, res, next) => {
  try {
    const errors = [];
    if (!validator.isEmail(req.body.email)) {
      errors.push({
        message: "E-Mail is invalid.",
      });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const findUser = await ChatUser.findOne({
      email: req.body.email,
    });

    if (findUser) {
      return res.status(403).json({
        message: "User Already Exists!",
        status: false,
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    if (hash) {
      const newUser = new ChatUser({
        email: req.body.email,
        name: req.body.name,
        password: hash,
        status: "Active",
        email_varify: true,
      });

      const saveUser = await newUser.save();
      return res.status(201).json({
        message: "User created!",
        id: saveUser._id,
        email: saveUser.email,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.chatUserLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push({
      message: "E-Mail is invalid.",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  let loadedUser;
  try {
    const user = await ChatUser.findOne({
      email: email,
    });

    if (!user) {
      return res.status(403).json({
        message: "A user with this email could not be found.",
      });
    }
    if (user.status == "Inactive") {
      return res.status(403).json({
        message: "Your Account is Inacive !",
      });
    }
    if (!user.email_varify) {
      return res.status(403).json({
        message: "Your Email is Not verified !",
      });
    }

    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(403).json({
        message: "Wrong password!",
      });
    }

    const updateData = {
      _id: req.body._id,
      login_ip: req.ip,
      login_date: new Date(),
    };

    await user.updateOne({ _id: loadedUser._id }, updateData);

    const jwtData = {};

    jwtData.email = loadedUser.email;
    jwtData.userId = loadedUser._id.toString();
    jwtData.name = loadedUser.name;

    const token = jwt.sign(
      {
        jwtData,
      },
      Config.jwt,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      token: token,
      userId: loadedUser._id,
      expiresIn: 28800,
      email: loadedUser.email,
      name: loadedUser.name,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*0123456789";
  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

exports.getUsers = async (req, res, next) => {
  const pageSize = +req.query.pagesize || 100;
  const currentPage = +req.query.page;
  const search = req.query.search;
  var where = {};
  if (search) {
    where.email = {
      $regex: search,
      $options: "i",
    };
  }
  where._id = {$nin: [req.userId]}
  let postQuery = ChatUser.find(where).select("_id email name createdAt").sort({
    createdAt: "desc",
  });

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize).exec;
  }
  postQuery
    .then((documents) => {
      fetchedUsers = documents;
      return ChatUser.countDocuments(where);
    })
    .then((count) => {
      res.status(200).json({
        message: "Users Fetched successfully!",
        users: fetchedUsers,
        userCount: count,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Fetching Failed!";
      }
      next(err);
    });
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await ChatUser.findOne({
      _id: req.params.id,
    }).select("_id email name createdAt");
    if (!user) {
      return res.status(200).json({
        message: "Faild to fetch User Details!",
        status: false,
      });
    }
    return res.status(200).json({
      message: "User Details!",
      user: user,
      status: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await ChatUser.find({
      _id: req.params.id,
    }).select("_id email name createdAt");
    if (!user) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    return res.status(200).json({
      message: "Users Fetched successfully!",
      user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    var userData = {
      _id: req.body.id,
      name: req.body.first_name,
      updatedBy: req.userId,
    };

    await ChatUser.updateOne({ _id: req.params.id }, userData);

    return res.status(200).json({
      message: "Update successful!",
      status: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await ChatUser.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      message: "Deletion successful!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Deleting failed!",
    });
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const search = req.query.search;
    var where = {};
    if (!search) {
      res.status(200).json({
        message: "Users Fetched successfully!",
        users: 0,
      });
    }

    where.first_name = {
      $regex: search,
      $options: "i",
    };
    where.status = "Active";

    const searchUsers = await ChatUser.find(where)
      .select("_id email name")
      .limit(10);

    return res.status(200).json({
      message: "Fetched successfully!",
      users: searchUsers,
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    //INFO: handle logout here
    res.setHeader("Authorization", "");

    res.status(200).json({
      status: true,
      message: "Your logedout!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
