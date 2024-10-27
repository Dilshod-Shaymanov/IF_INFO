const express = require("express");
const {
  addAuthor,
  getAuthor,
  getByIdAuthor,
  updateAuthor,
  deleteAuthor,
  loginAuthor,
  logoutAuthor,
  refreshToken,
  authorActivate,
} = require("../controllers/author.controller");
const authorPolice = require("../middleware/author_police");
const router = express.Router();

const authorRolesPolice = require("../middleware/author_rolice_police");


router.post("/login", loginAuthor);
router.post("/add", addAuthor);
router.post("/refresh",refreshToken);
router.get("/logout",logoutAuthor);
router.get("/activate/:link",authorActivate);

router.get("/",authorPolice, getAuthor);
router.get("/:id", authorRolesPolice(["DELETE","READ"]), getByIdAuthor);


router.patch("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
