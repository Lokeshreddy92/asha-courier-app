const express = require("express"),
 multer = require('multer'),
 AttachmentController = require("../controllers/attachments");

const storage = multer.diskStorage({
    destination : function(req,file,callback){
        callback(null, './uploads/');
    },
    filename: function(req,file,callback){
        callback(null, file.originalname);
    }
});

const upload = multer({ storage : storage});

const router = express.Router();

router.post("/create", upload.single('file'), AttachmentController.addAttachment);

router.get("/getattachments", AttachmentController.getAttachments);

router.get("/:id", AttachmentController.getAttachmentById);

router.put("/:id", upload.single('file'), AttachmentController.updateAttachment);

router.delete("/:id", AttachmentController.deleteAttachment);

module.exports = router;
