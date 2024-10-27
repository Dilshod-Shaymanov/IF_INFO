const { errorHandler } = require("../helpers/error_handler");
const Tag = require("../schemas/Tag");
const mongoose = require("mongoose");

const addTag = async (req, res) => {
  try {
    const { topic_id, category_id } = req.body;
    const newTag = await Tag.create({ topic_id, category_id });

    res.status(201).send({ message: "Yangi Tag qo'shildi!", data: newTag });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTag = async (req, res) => {
  try {
    const tags = await Tag.find().populate("topic_id category_id");
    res.send(tags);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateTag = async (req, res) => {
  try {
    const id = req.params.id;
    const { topic_id, category_id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { topic_id, category_id },
      { new: true }
    ).populate("topic_id category_id");

    if (!updatedTag) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }

    res.send({ message: "Tag muvaffaqiyatli yangilandi", data: updatedTag });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdTag = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const tag = await Tag.findById(id).populate("topic_id category_id");

    if (!tag) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }

    res.send(tag);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteTag = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res.status(404).send({ message: "Tag topilmadi" });
    }

    res.send({ message: "Tag muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addTag,
  getTag,
  updateTag,
  getByIdTag,
  deleteTag,
};
