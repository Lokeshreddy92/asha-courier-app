const express = require("express"),
  TicketsController = require("../controllers/tickets");

const router = express.Router();

router.put("/updatestatus/:id", TicketsController.updateTicketStatus);

router.get("/gettickets/:pid", TicketsController.getTicketsByProjectId);

router.post("/create", TicketsController.addTicket);

router.get("/gettickets", TicketsController.getTickets);

router.get("/:id", TicketsController.getTicketById);

router.put("/:id", TicketsController.updateTicket);

router.delete("/:id", TicketsController.deleteTicket);

module.exports = router;
