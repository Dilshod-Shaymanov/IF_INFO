const { errorHandler } = require("../helpers/error_handler");
const Desc_topic = require("../schemas/Desc_topic");
const mongoose = require("mongoose");

const addDesc = async (req, res) => {
  try {
    const { desc_id, topic_id } = req.body;
    const newDesc = await Desc_topic.create({ desc_id, topic_id });

    res
      .status(201)
      .send({ message: "Yangi Desc_topic qo'shildi!", data: newDesc });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDesc = async (req, res) => {
  try {
    const des = await Desc_topic.find().populate("desc_id topic_id");
    res.send(des);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateDesc = async (req, res) => {
  try {
    const id = req.params.id;
    const { desc_id, topic_id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const updatedDesc = await Desc_topic.findByIdAndUpdate(
      id,
      { desc_id, topic_id },
      { new: true }
    ).populate("desc_id topic_id");

    if (!updatedDesc) {
      return res.status(404).send({ message: "Desc_topic topilmadi" });
    }

    res.send({
      message: "Desc_topic muvaffaqiyatli yangilandi",
      data: updatedDesc,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdDesc = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const descTopic = await Desc_topic.findById(id).populate(
      "desc_id topic_id"
    );

    if (!descTopic) {
      return res.status(404).send({ message: "Desc_topic topilmadi" });
    }

    res.send(descTopic);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDesc = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const deletedDesc = await Desc_topic.findByIdAndDelete(id);

    if (!deletedDesc) {
      return res.status(404).send({ message: "Desc_topic topilmadi" });
    }

    res.send({ message: "Desc_topic muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addDesc,
  getDesc,
  updateDesc,
  getByIdDesc,
  deleteDesc,
};
