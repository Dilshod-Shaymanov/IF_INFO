const express = require("express");
const {
  addSnonim,
  getSinonim,
  getByIdSinonim,
  deleteSnonim,
  updateSnonim,
} = require("../controllers/sinonim.controller");

const router = express.Router();
router.post("/add", addSnonim);
router.get("/", getSinonim);
router.get("/:id", getByIdSinonim);
router.patch("/:id", updateSnonim);
router.delete("/:id", deleteSnonim);

module.exports = router;
