const express = require("express");
const { addQuestion_answer, getQuestion_answer, getByIdQuestion_answer, updateQuestion_answer, deleteQuestion_answer } = require("../controllers/question_answer.controlleer");

const router = express.Router();
router.post("/add", addQuestion_answer);
router.get("/", getQuestion_answer);
router.get("/:id", getByIdQuestion_answer);
router.delete("/:id", deleteQuestion_answer);
router.patch("/:id", updateQuestion_answer);


module.exports = router;
