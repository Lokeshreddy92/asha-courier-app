const express = require("express"),
  WorkController = require("../controllers/user-work-experience");

const router = express.Router();

router.post("/create", WorkController.addWorkEx);

router.get("/getworks/:userid", WorkController.getWorks);

router.get("/:id", WorkController.getWorkById);

router.put("/:id", WorkController.updateWork);

router.delete("/:id", WorkController.deleteWork);

module.exports = router;
