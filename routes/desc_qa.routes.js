const express = require("express");
const {
  addDescQa,
  getDescQa,
  getByIdDescQa,
  updateDescQa,
  deleteDescQa,
} = require("../controllers/desc_qa.controller");

const router = express.Router();
router.post("/add", addDescQa);
router.get("/", getDescQa);
router.get("/:id", getByIdDescQa);
router.patch("/:id", updateDescQa);
router.delete("/:id", deleteDescQa);

module.exports = router;
