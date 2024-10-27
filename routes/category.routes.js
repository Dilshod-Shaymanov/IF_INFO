const express = require("express");
const {
  addCategory,
  getcategory,
  deleteCategory,
  updateCategory,
  getByIdCategory,
} = require("../controllers/category");

const router = express.Router();
router.post("/add", addCategory);
router.get("/", getcategory);
router.get("/:id", getByIdCategory);
router.delete("/:id", deleteCategory);
router.patch("/:id", updateCategory);

module.exports = router;
