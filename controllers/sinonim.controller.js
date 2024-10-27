const { errorHandler } = require("../helpers/error_handler");
const Snonims = require("../schemas/snonims");
const mongoose = require("mongoose");

const addSnonim = async (req, res) => {
  try {
    const { desc_id, dict_id } = req.body;
    const newSinonim = await Snonims.create({ desc_id, dict_id });

    res.status(201).send({ message: "Yangi Sinonim qo'shildi!", newSinonim });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSinonim = async (req, res) => {
  try {
    const des = await Snonims.find().populate("desc_id dict_id");
    res.send(des);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateSnonim = async (req, res) => {
  try {
    const id = req.params.id;
    const { desc_id, dict_id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const updatedSinonim = await Snonims.findByIdAndUpdate(
      id,
      { desc_id, dict_id },
      { new: true }
    ).populate("desc_id dict_id");

    if (!updatedSinonim) {
      return res.status(404).send({ message: "Sinonim topilmadi" });
    }

    res.send({
      message: "Sinonim muvaffaqiyatli yangilandi",
      data: updatedSinonim,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdSinonim = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const sinonim = await Snonims.findById(id).populate("desc_id dict_id");

    if (!sinonim) {
      return res.status(404).send({ message: "Sinonim topilmadi" });
    }

    res.send(sinonim);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSnonim = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const deletedSinonim = await Snonims.findByIdAndDelete(id);

    if (!deletedSinonim) {
      return res.status(404).send({ message: "Sinonim topilmadi" });
    }

    res.send({ message: "Sinonim muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addSnonim,
  getSinonim,
  updateSnonim,
  getByIdSinonim,
  deleteSnonim,
};
