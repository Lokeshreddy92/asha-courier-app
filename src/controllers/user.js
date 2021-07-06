const bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  crypto = require("crypto"),
  User = require("../models/user"),
  JobDetails = require("../models/job-details"),
  UserAddress = require("../models/user-address-details"),
  Leaves = require("../models/leaves"),
  AccessToken = require("../models/access-tokens"),
  Config = require("../config/config"),
  validator = require("validator"),
  sgMail = require("@sendgrid/mail");

sgMail.setApiKey(Config.sendgrid_api_key);

exports.createUser = async (req, res, next) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(403).json({ message: "User Already Exists!" });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      personal_email: "jyotheeswar.chowdary@smarterp.com",
      password: hash,
      password_update: 1,
      mobile: 9700788443,
      role: 1,
      status: "Active",
      first_name: "Admin",
      last_name: "Admin",
      emp_ID: "E0" + Math.floor(Math.random() * 1000 + 1),
      leave_balance: 0,
      password: hash,
      password_update: 0,
      gender: "Male",
      mobile: 9700788443,
      marital_status: "none",
      email_varify: true,
      status: "Active",
    });

    const saveUser = await newUser.save();

    const newJob = new JobDetails({
      categoryId: "5e76154e9fc3e9c790addf2a",
      subcategoryId: "5e76154e9fc3e9c790addf2a",
      jobId: "5e76154e9fc3e9c790addf2a",
      job_location: "India, Bangalore",
      job_specification: "Admin",
      employment_status: "Full-Time Permanent",
      work_shift: "Full Time",
      join_date: new Date(),
      userId: saveUser._id,
    });

    const saveJob = await newJob.save();

    const newAddress = new UserAddress({
      address1: "Bangalore",
      address2: "Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      zip_code: 517416,
      userId: saveUser._id,
    });

    const saveAddress = await newAddress.save();

    saveUser.jobDetailsId = saveJob._id;
    saveUser.userAddressId = saveAddress._id;

    const updateUser = await saveUser.save();

    return res.status(201).json({
      message: "User created!",
      result: updateUser,
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const makeid = async () => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*0123456789";
  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

exports.createCustomer = async (req, res, next) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(403).json({ message: "User Already Exists!" });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      personal_email: req.body.email,
      password: hash,
      password_update: 1,
      mobile: 9700788443,
      role: 4,
      status: "Active",
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hash,
      password_update: 0,
      mobile: 9700788443,
      marital_status: "none",
      email_varify: true,
      status: "Active",
    });

    const saveUser = await newUser.save();

    const newAddress = new UserAddress({
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zip_code: req.body.zip_code,
      userId: saveUser._id,
    });

    const saveAddress = await newAddress.save();

    saveUser.userAddressId = saveAddress._id;

    const updateUser = await saveUser.save();

    const msg = {
      to: saveUser.email,
      bcc: Config.sendgrid_email_acc,
      from: Config.sendgrid_email_acc,
      subject: `Welcome to Smart Courier..! ${saveUser.first_name} ${saveUser.last_name}`,
      templateId: "d-4839ddfc1d244bd3a108953223c15a5b",
      substitutionWrappers: ["{{", "}}"],
      dynamic_template_data: {
        subject: `Welcome to Smart Courier..! ${saveUser.first_name} ${saveUser.last_name}`,
        name: `${saveUser.first_name} ${saveUser.last_name}`,
        email: saveUser.email,
        url: `${Config.ip}:${Config.http_port}`,
      },
    };

    sgMail.send(msg);
    return res.status(201).json({
      message: "User created!",
      result: updateUser,
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createNewUsers = async (req, res, next) => {
  try {
    const errors = [];

    if (!validator.isEmail(req.body.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const data = await User.findOne({ email: req.body.email });

    if (data) {
      res.status(403).json({ message: "User Already Exists!" });
    }

    const password = await makeid();
    const hashpass = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: req.body.email,
      personal_email: req.body.personal_email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      // emp_ID: "E0"+Math.floor((Math.random() * 1000) + 1),
      leave_balance: req.body.leave_balance,
      password: hashpass,
      password_update: 0,
      role: req.body.role,
      mobile: req.body.mobile,
      // gender: req.body.gender,
      assignee: req.body.assignee,
      assigneeId: req.body.assigneeId,
      email_varify: true,
      join_date: req.body.join_date,
      status: "Active",
      createdBy: req.userId,
    });

    const saveUser = await newUser.save();

    const newJob = new JobDetails({
      categoryId: req.body.categoryId,
      subcategoryId: req.body.subcategoryId,
      jobId: req.body.jobId,
      job_location: req.body.job_location,
      work_shift: req.body.work_shift,
      employment_status: req.body.employment_status,
      job_specification: req.body.job_specification,
      employment_status: req.body.employment_status,
      job_specification: req.body.job_specification,
      join_date: req.body.join_date,
      userId: saveUser._id,
    });

    const saveJob = await newJob.save();

    const newAddress = new UserAddress({
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zip_code: req.body.zip_code,
      userId: saveUser._id,
    });

    const saveAddress = await newAddress.save();

    saveUser.jobDetailsId = saveJob._id;
    saveUser.userAddressId = saveAddress._id;
    await saveUser.save();

    const msg = {
      to: saveUser.email,
      bcc: Config.sendgrid_email_acc,
      from: Config.sendgrid_email_acc,
      subject: `Welcome to SmartCourier..! ${saveUser.first_name} ${saveUser.last_name}`,
      templateId: "d-4839ddfc1d244bd3a108953223c15a5b",
      substitutionWrappers: ["{{", "}}"],
      dynamic_template_data: {
        subject: `Welcome to SmartCourier..! ${saveUser.first_name} ${saveUser.last_name}`,
        name: `${saveUser.first_name} ${saveUser.last_name}`,
        email: saveUser.email,
        password: password,
        url: `${Config.ip}:${Config.http_port}`,
      },
    };

    sgMail.send(msg);

    return res.status(201).json({ message: "User created!", result: saveUser });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    var where = {};

    if (search) {
      where.email = { $regex: search, $options: "i" };
    }

    let postQuery = User.find(where)
      .populate("userAddressId", "address1 address2 state city county zip")
      .populate("jobDetailsId")
      .select(
        "_id email first_name last_name married_date assigneeId jobDetailsId userAddressId assignee profile_img role status mobile personal_email leave_balance role createdAt"
      )
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .sort({ createdAt: "desc" });
    // .populate({
    //   path:'jobDetailsId',
    //   populate: {
    //     path: 'jobId categoryId subcategoryId '
    //   },
    // })

    fetchedUsers = await postQuery;

    userCount = await User.countDocuments(where);

    return res.status(200).json({
      message: "Users Fetched successfully!",
      users: fetchedUsers,
      userCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .populate({
        path: "jobDetailsId",
        populate: {
          path: "jobId",
        },
      })
      .select(
        "_id email first_name married_date last_name assigneeId jobDetailsId userAddressId assignee role status mobile profile_img leave_balance createdAt"
      );

    return res.status(200).json({ message: "User Details!", user: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.getUserSkills = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userid }).select(
      "_id email linkedin facebook github twitter portfolio profile_img first_name last_name skills createdAt"
    );

    return res.status(200).json({ message: "User Details!", data: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.addSkill = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.params.userid }).select(
      "_id email skills"
    );

    user.skills.push({ skill: req.body.skill, years: req.body.years });

    const update = await user.save();

    return res.status(200).json({ message: "done!", data: update });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.updateSkill = async (req, res, next) => {
  try {
    var userData = {
      _id: req.params.userid,
      skills: req.body,
    };

    await User.updateOne({ _id: req.params.userid }, userData);

    return res.status(200).json({ message: "done!", status: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Update Failed!";
    }
    next(err);
  }
};

exports.updateSocialLinks = async (req, res, next) => {
  try {
    var userData = {
      _id: req.params.userid,
      portfolio: req.body.portfolio,
      facebook: req.body.facebook,
      github: req.body.github,
      linkedin: req.body.linkedin,
      twitter: req.body.twitter,
    };
    await User.updateOne({ _id: req.params.userid }, userData);

    return res.status(200).json({ message: "done!", status: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Update Failed!";
    }
    next(err);
  }
};

exports.getAnniversaries = async (req, res, next) => {
  try {
    const date = new Date(),
      m = date.getMonth() + 1,
      d = date.getDate();

    const user = await User.aggregate([
      {
        $project: {
          first_name: 1,
          last_name: 1,
          email: 1,
          profile_img: 1,
          join_date2: "$join_date",
          month: { $month: "$join_date" },
          day: { $dayOfMonth: "$join_date" },
        },
      },
      {
        $match: { month: m },
      },
    ]);

    return res.status(200).json({ message: "User Details!", data: user });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.getUsersforDirectory = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    var where = { status: "Active" };

    if (search) {
      where.email = { $regex: search, $options: "i" };
    }

    let postQuery = User.find(where)
      .populate({
        path: "jobDetailsId",
        populate: {
          path: "jobId",
        },
      })
      .select(
        "_id email first_name last_name location assigneeId jobDetailsId  assignee mobile personal_email profile_img leave_balance"
      ) 
      .limit(pageSize)
      .sort({ createdAt: "desc" });

    let users = await postQuery;

    let userCount = await User.countDocuments(where);

    return res.status(200).json({
      message: "Users Fetched successfully!",
      users,
      userCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.getAssigendUsers = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;

    var where = { assigneeId: { $in: [req.params.id] } };
    if (search) {
      where.email = { $regex: search, $options: "i" };
    }
    let postQuery = await User.find(where)
      .populate("jobDetailsId")
      .select(
        "_id email first_name last_name assigneeId jobDetailsId userAddressId assignee role status mobile personal_email leave_balance role createdAt"
      )
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .sort({ createdAt: "desc" });

    let users = await postQuery;
    let userCount = await User.countDocuments(where);

    return res.status(200).json({
      message: "Users Fetched successfully!",
      users,
      userCount,
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

const getType = async (type) => {
  return type == 1
    ? "leave_balance"
    : type == 2
    ? "camp_off"
    : type == 3
    ? "optional_holidays"
    : type == 4
    ? "marternity_leave"
    : type == 5
    ? "paternity_leave"
    : "work_form_home";
};

exports.getLeaveBlance = async (req, res, next) => {
  try {
    const d = new Date(),
      month = d.getMonth(),
      year = d.getFullYear(),
      day = d.getDate();

    const type = await getType(req.params.leavetype);

    const getBalance = await User.find({ _id: req.params.id }).select(
      `_id ${type}`
    );

    const getAppliedCount = await Leaves.countDocuments({
      userId: req.params.id,
      createdAt: { $gte: `${year}-01-01`, $lte: `${year}-12-31` },
    });
    let balance = getBalance[0][type];
    return res.status(200).json({
      message: "Fetched successfully!",
      data: { balance, count: getAppliedCount },
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

exports.userLeaveBalace = async (req, res, next) => {
  try {
    const d = new Date(),
      month = d.getMonth(),
      year = d.getFullYear(),
      day = d.getDate();

    const getBalance = await User.find({ _id: req.params.id }).select(
      `_id leave_balance camp_off optional_holidays marternity_leave paternity_leave work_form_home`
    );

    const getAppliedCount = await Leaves.countDocuments({
      userId: req.params.id,
      createdAt: { $gte: `${year}-01-01`, $lte: `${year}-12-31` },
    });

    return res.status(200).json({
      message: "Fetched successfully!",
      balance: getBalance,
      count: getAppliedCount,
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
    const user = await User.find({ _id: req.params.id })
      .populate(
        "userAddressId",
        "address1 address2 state city country zip_code"
      )
      .populate({
        path: "jobDetailsId",
        populate: {
          path: "jobId categoryId subcategoryId ",
        },
      })
      .select(
        "_id email first_name married_date last_name assigneeId profile_img emp_ID assignee mobile jobDetailsId userAddressId role status gender pan_no aadhar_no gender nationality marital_status date_of_birth personal_email leave_balance role createdAt"
      );

    //TODO: get to multi level populate in category/subcategory
    //   .populate({
    //   path:'jobDetailsId',
    //   populate: {
    //     path: 'categoryId'
    //   },
    //   populate: {
    //     path: 'subcategoryId'
    //   },
    //   populate: {
    //     path: 'jobId'
    //   }
    // })

    return res
      .status(200)
      .json({ message: "Users Fetched successfully!", user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "Fetching Failed!";
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userData = {
      _id: req.body.id,
      email: req.body.email,
      personal_email: req.body.personal_email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      leave_balance: req.body.leave_balance,
      role: req.body.role,
      mobile: req.body.mobile,
      gender: req.body.gender,
      assignee: req.body.assignee,
      assigneeId: req.body.assigneeId,
      updatedBy: req.userId,
    };
    await User.updateOne({ _id: req.params.id }, userData);

    const updateJobDetails = {
      categoryId: req.body.categoryId,
      subcategoryId: req.body.subcategoryId,
      jobId: req.body.jobId,
      job_location: req.body.job_location,
      work_shift: req.body.work_shift,
      employment_status: req.body.employment_status,
      job_specification: req.body.job_specification,
      employment_status: req.body.employment_status,
      job_specification: req.body.job_specification,
      join_date: req.body.join_date,
    };

    await JobDetails.updateOne(
      { _id: req.body.jobDetailsId },
      updateJobDetails
    );
    const addressData = {
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zip_code: req.body.zip_code,
    };

    await UserAddress.updateOne(
      { _id: req.body.userAddressId, userId: req.body.id },
      addressData
    );

    return res
      .status(200)
      .json({ message: "Update successful!", status: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProfileInfo = async (req, res, next) => {
  try {
    let data = {
      id: req.params.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      personal_email: req.body.personal_email,
      date_of_birth: req.body.date_of_birth,
      marital_status: req.body.marital_status,
      nationality: req.body.nationality,
      aadhar_no: req.body.aadhar_no,
      pan_no: req.body.pan_no,
      married_date: req.body.married_date,
      gender: req.body.gender,
      mobile: req.body.mobile,
    };
    await User.updateOne({ _id: req.params.id }, data);

    return res
      .status(200)
      .json({ message: "Update successful!", status: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateContactInfo = async (req, res, next) => {
  try {
    let data = {
      id: req.params.id,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zip_code: req.body.zip_code,
    };
    await UserAddress.updateOne({ _id: req.params.id }, data);
    return res
      .status(200)
      .json({ message: "Update successful!", status: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: "Deletion successful!" });
  } catch (error) {
    res.status(500).json({
      message: "Deleting failed!",
    });
  }
};

exports.activateUserAccount = async (req, res, next) => {
  try {
    var user = {
      _id: req.params.id,
      status: "Active",
    };

    await User.updateOne({ _id: req.params.id }, user);

    return res.status(200).json({ message: "Update successful!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deactivateUserAccount = async (req, res, next) => {
  try {
    var user = {
      _id: req.params.id,
      status: "Inactive",
    };

    await User.updateOne({ _id: req.params.id }, user);
    await AccessToken.deleteMany({ userId: req.params.id });

    return res.status(200).json({ message: "Update successful!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.userLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push({ message: "E-Mail is invalid." });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  let loadedUser;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(403)
        .json({ message: "A user with this email could not be found." });
    }

    if (user.status == "Inactive") {
      return res.status(403).json({ message: "Your Account is Inacive !" });
    }

    if (!user.email_varify) {
      return res.status(403).json({ message: "Your Email is Not verified !" });
    }

    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(403).json({ message: "Wrong password!" });
    }

    const updateData = {
      _id: req.body._id,
      login_ip: req.ip,
      login_date: new Date(),
    };

    await user.updateOne({ _id: loadedUser._id }, updateData);

    const jwtData = {
      email: loadedUser.email,
      userId: loadedUser._id.toString(),
      role: loadedUser.role,
    };

    const token = jwt.sign({ jwtData }, Config.jwt, { expiresIn: "8h" });

    var newToken = new AccessToken({
      token: token,
      userId: loadedUser._id,
    });

    await newToken.save();

    return res.status(200).json({
      token: token,
      expiresIn: 28800,
      name: loadedUser.first_name + " " + loadedUser.last_name,
      userId: loadedUser._id,
      role: loadedUser.role,
      email: loadedUser.email,
      profile_img: loadedUser.profile_img,
      password_update: loadedUser.password_update,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await AccessToken.deleteMany({ _id: req.body.userId });
    return res.status(200).json({
      status: true,
      data: "Your logedout!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  try {
    const userData = await User.findOne({ email: email }).select(
      "_id email first_name last_name reset_password_token reset_password_expires"
    );

    if (!userData) {
      return res
        .status(403)
        .json({ message: "A user with this email could not be found !" });
    }

    var buffer = crypto.randomBytes(20);
    var token = buffer.toString("hex");
    await User.updateOne(
      { _id: userData._id },
      {
        reset_password_token: token,
        reset_password_expires: Date.now() + 500000,
      }
    );

    const msg = {
      to: userData.email,
      from: "jyotheeswar.chowdary@smarterp.com",
      subject: "Reset Password Link!",
      templateId: "d-ca54524ba1bc4b5e82dde2b40602280d",
      substitutionWrappers: ["{{", "}}"],
      dynamic_template_data: {
        subject: "Reset Password Link!",
        name: `${userData.first_name}`,
        email: userData.email,
        url: `${Config.ip}:${Config.http_port}/?token=${token}`,
      },
    };

    sgMail.send(msg);

    return res
      .status(200)
      .json({ message: "Reset Password link sent your Email." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      reset_password_token: req.params.token,
      reset_password_expires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(403).json({
        status: false,
        message: "Reset password link Expired!",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Token Found!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(403).json({
        status: false,
        message: "Email ot exit..!",
      });
    }
    await User.updateOne({ _id: user._id }, { email_varify: true });

    return res.status(200).json({
      status: true,
      message: "Email verified..!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateResetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ reset_password_token: req.body.token });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Password reset token is invalid or has expired.",
      });
    }
    if (req.body.password === req.body.confirmPassword) {
      const hash = await bcrypt.hash(req.body.password, 10);
      user.password = hash;
      await user.save();

      return res
        .status(200)
        .json({ status: true, message: "Password Updated!" });
    } else {
      return res.status(422).send({
        status: false,
        message: "Passwords do not match",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
      res.status(400).json({
        status: false,
        message: "User Not Found.",
      });
    }
    const isEqual = await bcrypt.compare(
      req.body.currenPasswprd,
      user.password
    );

    if (!isEqual) {
      res.status(403).json({
        status: false,
        message: "Current password is Wrong!",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(422).send({
        status: false,
        message: "Passwords do not match",
      });
    }
    
    const hash = await bcrypt.hash(req.body.password, 10);

    await User.updateOne(
      { _id: req.body.id },
      {
        password: hash,
        password_update: 1,
      }
    );

    return res.status(200).json({
      status: true,
      message: "Password Updated!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginUsersToday = async (req, res, next) => {
  const d = new Date(),
    newDate = new Date(
      d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()
    );

  const data = await User.find({
    createdBy: req.userId,
    login_date: newDate,
  })
    .select("_id name email login_data login_ip role")
    .sort({ login_data: "desc" });

  return res.status(200).json({ status: true, data });
};

exports.errorEmailTrigger = async (req, res, next) => {
  try {
    const email = req.body.email;

    const msg = {
      to: "jyotheeswar.chowdary@smarterp.com",
      from: "jyotheeswar.chowdary@smarterp.com",
      subject: "Error while running APP",
      html: `Hello...  Admin, <br /> <br />
      Email: ${req.body.email} <br /> Error Message: ${req.body.error} <br />.`,
    };

    sgMail.send(msg);

    return res
      .status(201)
      .json({ status: true, message: "Email Sent to Admin!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const email = req.body.email;

    const msg = {
      to: process.env.SENDGRID_EMAIL_ACC || "jyotheeswar.chowdary@smarterp.com",
      from: process.env.SENDGRID_EMAIL_ACC || "jyotheeswar.chowdary@smarterp.com",
      subject: `Request from ${req.body.name}`,
      html: `Hello...  Admin, <br /> <br />
      Email: ${req.body.email} <br />
      Name: ${req.body.name}  <br /> Mobile: ${req.body.mobile} <br />
      Location: ${req.body.location}
      Error Message: ${req.body.message} <br />.`,
    };

    sgMail.send(msg);

    return res.status(200).json({
      status: true,
      message: "Email Sent to Admin!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const search = req.query.search;
    var where = {};

    if (!search) {
      res.status(403).json({
        message: "Please provide input!",
      });
    }

    where.first_name = { $regex: search, $options: "i" };
    where.status = "Active";

    const users = await User.find(where)
      .select("_id email first_name last_name")
      .limit(10);

    return res.status(200).json({
      message: "Fetched successfully!",
      users,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Fetching Failed!";
    }
    next(err);
  }
};

exports.uploadProfileImg = async (req, res, next) => {
  try {
    const user = {
      _id: req.userId,
      profile_img: req.file.filename,
    };

    await User.updateOne({ _id: req.userId }, user);

    return res
      .status(200)
      .json({ message: "Profle Image Update successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
