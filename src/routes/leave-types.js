const express = require("express"),
  LeaveTypesController = require("../controllers/leave-types");

const router = express.Router();

router.post("/create", LeaveTypesController.newLeaveType);

router.get("/getleavetypes", LeaveTypesController.getLeaveTypes);

router.get("/:id", LeaveTypesController.getLeaveTypeById);

router.put("/:id", LeaveTypesController.updateLeaveType);

router.delete("/:id", LeaveTypesController.deleteLeaveType);

module.exports = router;
