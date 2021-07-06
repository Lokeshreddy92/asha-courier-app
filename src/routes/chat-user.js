const express = require("express"),
  ChatUserController = require("../controllers/chat-user");

const router = express.Router();
 
router.get("/get_user_detials/:id", ChatUserController.getUserDetails);

router.get("/search", ChatUserController.searchUsers);

router.get("/get_users", ChatUserController.getUsers);

router.get("/:id", ChatUserController.getUser);

router.put("/:id", ChatUserController.updateUser);

router.delete("/:id", ChatUserController.deleteUser);

module.exports = router;
