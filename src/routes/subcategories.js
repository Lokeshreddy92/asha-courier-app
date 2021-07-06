const express = require("express"),
  SubCategoryController = require("../controllers/subcategories");

const router = express.Router();

router.post("/create", SubCategoryController.addSubCategory);

router.get("/getsubcategories", SubCategoryController.getSubCategories);

router.get("/:id", SubCategoryController.getSubCategoryById);

router.get("/categories/:catId", SubCategoryController.getCategoriesById);

router.put("/:id", SubCategoryController.updateSubCategory);

router.delete("/:id", SubCategoryController.deleteSubCategory);

module.exports = router;
