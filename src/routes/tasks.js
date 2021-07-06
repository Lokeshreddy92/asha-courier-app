const express = require("express"),
  TaskController = require("../controllers/tasks");

const router = express.Router();

router.get("/getdetails", TaskController.getDashboardData);

router.put("/movetask/:id", TaskController.moveTask);

router.put("/updatestatus/:id", TaskController.updateTaskStatus);

router.get("/gettasks/:ticketId", TaskController.getTaskByTicketId);

router.post("/create", TaskController.addTask);

router.get("/gettasks", TaskController.getTasks);

router.get("/:id", TaskController.getTaskById);

router.put("/:id", TaskController.updateTask);

router.delete("/:id", TaskController.deleteTask);

router.get("/gettasktages/:pid", TaskController.getTaskTages);

module.exports = router;
