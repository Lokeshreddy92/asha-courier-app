const express = require("express");

const CategoryController = require("../controllers/categories");

const router = express.Router();

router.post("/create", CategoryController.addCategory);

router.get("/getcategories", CategoryController.getCategories);

router.get("/:id", CategoryController.getCategoryById);

router.put("/:id", CategoryController.updateCategory);

router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
