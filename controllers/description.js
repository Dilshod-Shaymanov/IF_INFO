const { errorHandler } = require("../helpers/error_handler");
const Description = require("../schemas/Description");
const mongoose = require("mongoose");

const addDescription = async (req, res) => {
  try {
    const { description, category_id } = req.body;
    const newDisc = await Description.create({ description, category_id });

    res.status(201).send({ message: "Yangi Description qo'shildi!", newDisc });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescription = async (req, res) => {
  try {
    const des = await Description.find().populate("category_id");
    res.send(des);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateDescription = async (req, res) => {
  try {
    const id = req.params.id;
    const { description, category_id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const updatedDescription = await Description.findByIdAndUpdate(
      id,
      { description, category_id },
      { new: true }
    ).populate("category_id");

    if (!updatedDescription) {
      return res.status(404).send({ message: "Description topilmadi" });
    }

    res.send({
      message: "Description muvaffaqiyatli yangilandi",
      data: updatedDescription,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdDescription = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const description = await Description.findById(id).populate("category_id");

    if (!description) {
      return res.status(404).send({ message: "Description topilmadi" });
    }

    res.send(description);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDescription = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const deletedDescription = await Description.findByIdAndDelete(id);

    if (!deletedDescription) {
      return res.status(404).send({ message: "Description topilmadi" });
    }

    res.send({ message: "Description muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addDescription,
  getDescription,
  updateDescription,
  getByIdDescription,
  deleteDescription,
};
