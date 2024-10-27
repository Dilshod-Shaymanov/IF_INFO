const express = require("express");
const {
  addAuthor_social,
  getAuthor_social,
  deleteAuthor_social,
  updateAuthor_social,
  getByIdAuthor_social,
} = require("../controllers/author_social.controller");

const router = express.Router();
router.post("/add", addAuthor_social);
router.get("/", getAuthor_social);
router.delete("/:id", deleteAuthor_social);
router.patch("/:id", updateAuthor_social);
router.get("/:id", getByIdAuthor_social);

module.exports = router;
