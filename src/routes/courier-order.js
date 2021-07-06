const express = require("express"),
  OrderController = require("../controllers/courier-order");

const router = express.Router();

router.get("/getOrderDetials", OrderController.getCourierDashboardData);

router.post("/create", OrderController.addOrder);

router.get("/getOrders", OrderController.getOrders);

router.get("/:id", OrderController.getOrderById);

router.put("/:id", OrderController.updateOrder);

router.put("/updateStatus/:id", OrderController.updateOrderStatus);

router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
