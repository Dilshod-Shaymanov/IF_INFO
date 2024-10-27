const mongoose = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Guest = require("../schemas/Guest");

const addGuest = async (req, res) => {
  try {
    const { ip, os, device, browser } = req.body;
    const newGuest = await Guest.create({
      ip,
      os,
      device,
      browser,
    });

    res.status(201).send({ message: "Yangi Guest qo'shildi!", data: newGuest });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.send(guests);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateGuest = async (req, res) => {
  try {
    const id = req.params.id;
    const { ip, os, device, browser } = req.body;

    const updatedGuest = await Guest.findByIdAndUpdate(
      id,
      { ip, os, device, browser },
      { new: true }
    );

    if (!updatedGuest) {
      return res.status(404).send({ message: "Guest topilmadi" });
    }

    res.send({ message: "Guest yangilandi", data: updatedGuest });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteGuest = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedGuest = await Guest.findByIdAndDelete(id);

    if (!deletedGuest) {
      return res.status(404).send({ message: "Guest topilmadi" });
    }

    res.send({ message: "Guest o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdGuest = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const guest = await Guest.findById(id);

    if (!guest) {
      return res.status(404).send({ message: "Topic topilmadi" });
    }

    res.send(guest);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addGuest,
  getGuests,
  updateGuest,
  deleteGuest,
  getByIdGuest,
};
