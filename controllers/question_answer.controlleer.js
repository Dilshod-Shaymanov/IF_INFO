const { errorHandler } = require("../helpers/error_handler");
const Question_ansver = require("../schemas/Question_ansver");
const mongoose = require("mongoose");

// Yangi Question_Answer qo'shish
const addQuestion_answer = async (req, res) => {
  try {
    const {
      question,
      answer,
      created_date,
      updated_date,
      is_checked,
      user_id,
      expert_id,
    } = req.body;

    const newDisc = await Question_ansver.create({
      question,
      answer,
      created_date,
      updated_date,
      is_checked,
      user_id,
      expert_id,
    });

    res
      .status(201)
      .send({ message: "Yangi question qo'shildi!", data: newDisc });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Barcha Question_Answer yozuvlarini olish
const getQuestion_answer = async (req, res) => {
  try {
    const questions = await Question_ansver.find().populate(
      "expert_id user_id"
    );
    res.send(questions);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Question_Answer'ni ID orqali yangilash
const updateQuestion_answer = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      question,
      answer,
      created_date,
      updated_date,
      is_checked,
      user_id,
      expert_id,
    } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const updatedQuestion = await Question_ansver.findByIdAndUpdate(
      id,
      {
        question,
        answer,
        created_date,
        updated_date,
        is_checked,
        user_id,
        expert_id,
      },
      { new: true }
    ).populate("expert_id user_id");

    if (!updatedQuestion) {
      return res.status(404).send({ message: "Question_Answer topilmadi" });
    }

    res.send({
      message: "Question_Answer muvaffaqiyatli yangilandi",
      data: updatedQuestion,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Question_Answer'ni ID orqali olish
const getByIdQuestion_answer = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const question = await Question_ansver.findById(id).populate(
      "expert_id user_id"
    );

    if (!question) {
      return res.status(404).send({ message: "Question_Answer topilmadi" });
    }

    res.send(question);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Question_Answer'ni ID orqali o'chirish
const deleteQuestion_answer = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const deletedQuestion = await Question_ansver.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).send({ message: "Question_Answer topilmadi" });
    }

    res.send({ message: "Question_Answer muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addQuestion_answer,
  getQuestion_answer,
  updateQuestion_answer,
  getByIdQuestion_answer,
  deleteQuestion_answer,
};
