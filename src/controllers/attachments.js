const Attachment = require("../models/attachments");

exports.addAttachment = async (req, res, next) => {
  try {
    const newAttachment = new Attachment({
      attachment_name: req.body.attachment_name,
      attachment_desc: req.body.attachment_desc,
      attachment_url: req.file.filename,
      type: req.body.type,
      userId: req.userId,
    });

    await newAttachment.save();
    res.status(200).json({
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

exports.getAttachments = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    const type = req.query.type;
    const userId = req.query.userId;
    let attachmentQuery,
      where = { userId: userId, type: type };

    if (search) {
      where.attachment_name = { $regex: search, $options: "i" };
    }
    attachmentQuery = Attachment.find(where);

    if (pageSize && currentPage) {
      attachmentQuery
        .select(
          "_id attachment_name attachment_desc type attachment_url createdAt"
        )
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .sort({ createdAt: "desc" }).exec;
    }

    var attachment = await attachmentQuery;
    var attchmentCount = await Attachment.countDocuments({ userId: userId });

    return res.status(200).json({
      status: true,
      data: attachment,
      count: attchmentCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAttachmentById = async (req, res, next) => {
  try {
    const getAttachment = await Attachment.find({ _id: req.params.id });

    return res.status(200).json({
      message: "Fetched successfully!",
      data: getAttachment,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateAttachment = async (req, res, next) => {
  try {
    const attachment = {
      _id: req.body.id,
      attachment_name: req.body.attachment_name,
      attachment_desc: req.body.attachment_desc,
      attachment_url: req.file.filename,
      userId: req.userId,
    };

    await Attachment.updateOne({ _id: req.params.id }, attachment);

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

exports.deleteAttachment = async (req, res, next) => {
  try {
    await Attachment.deleteOne({ _id: req.params.id });
    
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
