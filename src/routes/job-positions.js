const express = require("express"),
  JobController = require("../controllers/job-positions");

const router = express.Router();

router.post("/create", JobController.addJob);

router.get("/getjobs", JobController.getJobs);

router.get("/:id", JobController.getJobById);

router.put("/:id", JobController.updateJob);

router.delete("/:id", JobController.deleteJob);

module.exports = router;
