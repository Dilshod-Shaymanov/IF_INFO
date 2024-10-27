const express = require("express");

const {
  addTerm,
  getTerm,
  updateTerm,
  delteTerm,
  getByTermId,
  getByLetter,
} = require("../controllers/dictionary");

const router = express.Router();
router.post("/create", addTerm);
router.get("/letter",getByLetter);

router.get("/term/:term",getByTermId)
router.get("/", getTerm);
router.patch("/update/:id", updateTerm);
router.delete("/:id", delteTerm);

module.exports = router;
