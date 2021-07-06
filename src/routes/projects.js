const express = require("express"),
  ProjectController = require("../controllers/projects");

const router = express.Router();

router.post("/create", ProjectController.addProject);

router.get("/getprojects", ProjectController.getProjects);

router.get("/:id", ProjectController.getProjectById);

router.put("/:id", ProjectController.updateProject);

router.delete("/:id", ProjectController.deleteProject);

module.exports = router;
