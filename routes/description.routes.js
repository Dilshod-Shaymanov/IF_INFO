const express = require("express");
const { addDescription, getDescription, getByIdDescription, deleteDescription, updateDescription } = require("../controllers/description");

const router = express.Router();
router.post("/add", addDescription);
router.get("/", getDescription);


router.get("/:id", getByIdDescription);
router.delete("/:id", deleteDescription);
router.patch("/:id", updateDescription);
module.exports = router;