const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../schemas/Dictionary");
const mongoose = require("mongoose");

const addTerm = async (req, res) => {
  try {
    const { term } = req.body;
    const dict = await Dictionary.findOne({
      term: new RegExp(term, "i"),
    });

    if (dict) {
      return res.status(400).send({ message: "Bunday termin bor" });
    }

    const newDictinary = await Dictionary.create({ term, letter: term[0] });

    res.status(201).send({ message: "Yangi termin qo'shildi!", newDictinary });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getTerm = async (req, res) => {
  try {
    const dict = await Dictionary.find();
    res.send(dict);
  } catch (error) {
    errorHandler(res, error);
  }
};


const updateTerm = async (req, res) => {
  try {
    const id = req.params.id;
    const { term } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const dict = await Dictionary.findByIdAndUpdate(id, {
      term,
      letter: term[0],
    });
    if (!dict) {
      return res.status(400).send({ message: "Bunday term topilmadi" });
    }

    res.send({ message: "Updated successfully", data: dict });
  } catch (error) {
    errorHandler(res, error);
  }
};


const delteTerm = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }
    const dict = await Dictionary.findByIdAndDelete(id);
    res.send({ message: "Deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};


const getByTermId = async (req, res) => {
  try {
    const terms = req.params.term;

    const dict = await Dictionary.find({ term: new RegExp(terms, "i") });
    res.send(dict);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByLetter = async (req, res) => {
  try {
    const letter = req.query; 
    const dict = await Dictionary.find({
      letter: new RegExp(letter.query, "i"), 
    });

    res.send(dict);
  } catch (error) {
    errorHandler(res, error);
  }
};


module.exports = {
  addTerm,
  getTerm,
  updateTerm,
  delteTerm,
  getByTermId,
  getByLetter
};
