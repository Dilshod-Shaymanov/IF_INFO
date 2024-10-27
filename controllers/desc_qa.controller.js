const { errorHandler } = require("../helpers/error_handler");
const Desc_qa = require("../schemas/Desc_qa");
const mongoose = require("mongoose");

const addDescQa = async (req, res) => {
  try {
    const { desc_id } = req.body;
    const newDisc = await Desc_qa.create({ desc_id });

    res
      .status(201)
      .send({ message: "Yangi Desc_qa qo'shildi!", data: newDisc });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescQa = async (req, res) => {
  try {
    const descQas = await Desc_qa.find().populate("desc_id");
    res.send(descQas);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateDescQa = async (req, res) => {
  try {
    const id = req.params.id;
    const { desc_id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const updatedDescQa = await Desc_qa.findByIdAndUpdate(
      id,
      { desc_id },
      { new: true }
    ).populate("desc_id");

    if (!updatedDescQa) {
      return res.status(404).send({ message: "Desc_qa topilmadi" });
    }

    res.send({
      message: "Desc_qa muvaffaqiyatli yangilandi",
      data: updatedDescQa,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdDescQa = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const descQa = await Desc_qa.findById(id).populate("desc_id");

    if (!descQa) {
      return res.status(404).send({ message: "Desc_qa topilmadi" });
    }

    res.send(descQa);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteDescQa = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const deletedDescQa = await Desc_qa.findByIdAndDelete(id);

    if (!deletedDescQa) {
      return res.status(404).send({ message: "Desc_qa topilmadi" });
    }

    res.send({ message: "Desc_qa muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addDescQa,
  getDescQa,
  updateDescQa,
  getByIdDescQa,
  deleteDescQa,
};
