const express = require("express");
const {
  addSocial,
  getSocial,
  getByIdSocial,
  deleteSocial,
  updateSocial,
} = require("../controllers/socila.controller");

const router = express.Router();
router.post("/add", addSocial);
router.get("/", getSocial);
router.get("/:id", getByIdSocial);
router.delete("/:id", deleteSocial);
router.patch("/:id", updateSocial);

module.exports = router;
