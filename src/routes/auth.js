const express = require("express"),
  multer = require("multer"),
  UserController = require("../controllers/user"),
  OrderController = require("../controllers/courier-order"),
  ChatUserController = require("../controllers/chat-user");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/chat/login", ChatUserController.chatUserLogin);

router.post("/customer_signup", UserController.createCustomer);

router.post("/signup", UserController.createUser);

router.post("/chat/signup", ChatUserController.createChatUser);

router.post("/sendMessage", UserController.sendMessage);

router.post("/login", UserController.userLogin);

router.post("/forgot_password", UserController.forgotPassword);

router.get("/reset_password/:token", UserController.resetPassword);

router.put("/verifyemail/:email", UserController.verifyEmail);

router.post("/update_reset_password", UserController.updateResetPassword);

router.post("/logout", UserController.logout);

router.get("/trackOrders", OrderController.trackOrders);

module.exports = router;
