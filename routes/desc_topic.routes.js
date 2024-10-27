const express = require("express");
const {
  addDesc,
  getDesc,
  getByIdDesc,
  deleteDesc,
  updateDesc,
} = require("../controllers/desc_topic.controller");

const router = express.Router();
router.post("/add", addDesc);
router.get("/", getDesc);
router.get("/:id", getByIdDesc);
router.delete("/:id", deleteDesc);
router.patch("/:id", updateDesc);

module.exports = router;
