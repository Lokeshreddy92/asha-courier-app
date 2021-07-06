const express = require("express"),
  ChatController = require("../controllers/chat");

const router = express.Router();

router.get("/backup_chat", ChatController.backupChats);

router.post("/send_message", ChatController.saveMessage);

router.get("/:receiverId", ChatController.getChats);

router.delete("/:senderId", ChatController.deleteUserChat);

module.exports = router;
