const express = require("express"),
  multer = require("multer"),
  CommentsController = require("../controllers/comments");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.put("/deletefile/:id", CommentsController.deleteFile);

router.post("/create", upload.single("file"), CommentsController.addComment);

router.get("/getcomments/:ticketId", CommentsController.getCommentByTicketId);

router.get("/getcomments", CommentsController.getComments);

router.get("/:id", CommentsController.getCommentById);

router.put("/:id", CommentsController.updateComment);

router.delete("/:id", CommentsController.deleteComment);

module.exports = router;
