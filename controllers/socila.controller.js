const { errorHandler } = require("../helpers/error_handler");
const Social = require("../schemas/Social");
const mongoose = require("mongoose");

const addSocial = async (req, res) => {
  try {
    const { name, icon_file } = req.body;
    const newSocial = await Social.create({ name, icon_file });

    res
      .status(201)
      .send({ message: "Yangi Social qo'shildi!", data: newSocial });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSocial = async (req, res) => {
  try {
    const socialLinks = await Social.find();
    res.send(socialLinks);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateSocial = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, icon_file } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const updatedSocial = await Social.findByIdAndUpdate(
      id,
      { name, icon_file },
      { new: true }
    );

    if (!updatedSocial) {
      return res.status(404).send({ message: "Social topilmadi" });
    }

    res.send({
      message: "Social muvaffaqiyatli yangilandi",
      data: updatedSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdSocial = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const social = await Social.findById(id);

    if (!social) {
      return res.status(404).send({ message: "Social topilmadi" });
    }

    res.send(social);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSocial = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const deletedSocial = await Social.findByIdAndDelete(id);

    if (!deletedSocial) {
      return res.status(404).send({ message: "Social topilmadi" });
    }

    res.send({ message: "Social muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addSocial,
  getSocial,
  updateSocial,
  getByIdSocial,
  deleteSocial,
};
