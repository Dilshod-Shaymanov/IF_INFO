const { errorHandler } = require("../helpers/error_handler");
const Topic = require("../schemas/topic");
const mongoose = require("mongoose");

const addTopic = async (req, res) => {
  try {
    const {
      author_id,
      topic_title,
      topic_text,
      created_date,
      updated_date,
      is_checked,
      is_approved,
      expert_id,
    } = req.body;

    const newTopic = await Topic.create({
      author_id,
      topic_title,
      topic_text,
      created_date,
      updated_date,
      is_checked,
      is_approved,
      expert_id,
    });

    res.status(201).send({ message: "Yangi Topic qo'shildi!", data: newTopic });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTopic = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.send(topics);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateTopic = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      author_id,
      topic_title,
      topic_text,
      created_date,
      updated_date,
      is_checked,
      is_approved,
      expert_id,
    } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      {
        author_id,
        topic_title,
        topic_text,
        created_date,
        updated_date,
        is_checked,
        is_approved,
        expert_id,
      },
      { new: true }
    );

    if (!updatedTopic) {
      return res.status(404).send({ message: "Topic topilmadi" });
    }

    res.send({
      message: "Topic muvaffaqiyatli yangilandi",
      data: updatedTopic,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdTopic = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const topic = await Topic.findById(id);

    if (!topic) {
      return res.status(404).send({ message: "Topic topilmadi" });
    }

    res.send(topic);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteTopic = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const deletedTopic = await Topic.findByIdAndDelete(id);

    if (!deletedTopic) {
      return res.status(404).send({ message: "Topic topilmadi" });
    }

    res.send({ message: "Topic muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addTopic,
  getTopic,
  updateTopic,
  getByIdTopic,
  deleteTopic,
};
