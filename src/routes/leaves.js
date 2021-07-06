const express = require("express"),
  LeaveController = require("../controllers/leaves");

const router = express.Router();

router.get("/getappliedleaves", LeaveController.appliedLeaves);

router.get("/chartdata", LeaveController.getMonthlyLeaves);

router.get("/getcalendarleaves", LeaveController.getLeavesForCalendar);

router.get("/getall", LeaveController.getAllLeaves);

router.post("/create", LeaveController.newLeave);

router.get("/getleaves", LeaveController.getLeaves);

router.get("/:id", LeaveController.getLeaveById);

router.put("/:id", LeaveController.updateLeave);

router.delete("/:id", LeaveController.deleteLeave);

router.put("/cancelleave/:id", LeaveController.cancelLeaveStatus);

router.put("/approveleave/:id", LeaveController.approveLeaveStatus);

router.get("/getassigneduserleaves/:id", LeaveController.getAssignedUserLeaves);

module.exports = router;
