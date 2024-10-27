const express = require("express");
const {
  addTopic,
  getTopic,
  deleteTopic,
  updateTopic,
  getByIdTopic,
} = require("../controllers/topic.controller");
const router = express.Router();

router.post("/add", addTopic);
router.get("/", getTopic);
router.delete("/:id", deleteTopic);
router.patch("/:id", updateTopic);
router.get("/:id", getByIdTopic);

module.exports = router;
