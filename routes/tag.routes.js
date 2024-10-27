const express = require("express");
const {
  getTag,
  addTag,
  getByIdTag,
  deleteTag,
  updateTag,
} = require("../controllers/tag.controller");

const router = express.Router();
router.post("/add", addTag);
router.get("/", getTag);
router.get("/:id", getByIdTag);
router.delete("/:id", deleteTag);
router.patch("/:id", updateTag);

module.exports = router;
