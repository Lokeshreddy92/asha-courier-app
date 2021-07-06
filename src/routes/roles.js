const express = require("express"),
  RolesController = require("../controllers/roles");

const router = express.Router();

router.post("/createrole", RolesController.addRoles);

router.get("/getroles", RolesController.getRoles);

router.get("/:id", RolesController.getRoleById);

router.put("/:id", RolesController.updateRoles);

router.delete("/:id", RolesController.deleteRoles);

module.exports = router;
