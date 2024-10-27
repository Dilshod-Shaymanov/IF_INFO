const { errorHandler } = require("../helpers/error_handler");
const Category = require("../schemas/Category");
const mongoose = require("mongoose");
const Joi = require("joi");
const { categoryValidation } = require("../validations/category.validations");

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);

    
    console.log(error);
    console.log(value);

    const { name, parent_category_id } = value;

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const category = await Category.findOne({
      term: new RegExp(name, "i"),
    });

    if (category) {
      return res.status(400).send({ message: "Bunday catogory bor" });
    }

    const newcat = await Category.create({ name, parent_category_id });

    res.status(201).send({ message: "Yangi category qo'shildi!", newcat });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getcategory = async (req, res) => {
  try {
    const cat = await Category.find();
    res.send(cat);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, parent_category_id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, parent_category_id },
      { new: true }
    );

    if (!category) {
      return res.status(400).send({ message: "Bunday category topilmadi" });
    }

    res.send({ message: "Category muvaffaqiyatli yangilandi", data: category });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdCategory = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Bunday category topilmadi" });
    }

    res.send(category);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).send({ message: "Bunday category topilmadi" });
    }

    res.send({ message: "Category muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addCategory,
  getcategory,
  updateCategory,
  getByIdCategory,
  deleteCategory,
};
