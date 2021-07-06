const express = require("express"),
  EduController = require("../controllers/user-education");

const router = express.Router();

router.post("/create", EduController.addEducation);

router.get("/geteducations/:userid", EduController.getEducations);

router.get("/:id", EduController.getEducationById);

router.put("/:id", EduController.updateEducation);

router.delete("/:id", EduController.deleteEducation);

module.exports = router;
