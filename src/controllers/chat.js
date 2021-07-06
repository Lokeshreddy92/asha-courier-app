const Chat = require("../models/chat"),
  _ = require("underscore");

exports.saveMessage = async (req, res, next) => {
  try {
    const io = req.app.get("socketio");
    
    const data = {
      message: req.body.message,
      senderId: req.userId,
      receiverId: req.body.receiverId,
      createdBy: req.userId,
    };

    const saveChat = new Chat(data);

    await saveChat.save();
    io.emit("message", saveChat);

    return res.status(201).json({
      message: "Message Saved!",
      status: true,
      chat: data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getChats = async (req, res, next) => {
  try {
    const senderChat = await Chat.find({
      senderId: req.userId,
      receiverId: req.params.receiverId,
    });
    const receiverChat = await Chat.find({
      senderId: req.params.receiverId,
      receiverId: req.userId,
    });

    let chats = senderChat.concat(...receiverChat);
    chats = _.sortBy(chats, "createdAt");

    return res.status(201).json({
      message: "Successfully Fetched!",
      status: true,
      chats,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUserChat = async (req, res, next) => {
  try {
    await Chat.deleteMany({ senderId: req.params.senderId });
    return res.status(201).json({
      message: "Successfully Deleted Chat!",
      status: true,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.backupChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ senderId: req.userId }).select(
      "_id senderId message"
    );

    return res.status(201).json({
      message: "Backup Chat!",
      status: true,
      chats,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
