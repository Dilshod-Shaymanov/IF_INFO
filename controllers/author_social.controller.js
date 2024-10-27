const { errorHandler } = require("../helpers/error_handler");
const Author_social = require("../schemas/Author_social");
const mongoose = require("mongoose");

const addAuthor_social = async (req, res) => {
  try {
    const { author_id, social_id, social_link } = req.body;
    const newSocial = await Author_social.create({
      author_id,
      social_id,
      social_link,
    });

    res
      .status(201)
      .send({ message: "Yangi Author_social qo'shildi!", data: newSocial });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthor_social = async (req, res) => {
  try {
    const socialLinks = await Author_social.find().populate(
      "author_id social_id"
    );
    res.send(socialLinks);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthor_social = async (req, res) => {
  try {
    const id = req.params.id;
    const { author_id, social_id, social_link } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const updatedSocial = await Author_social.findByIdAndUpdate(
      id,
      { author_id, social_id, social_link },
      { new: true }
    ).populate("author_id social_id");

    if (!updatedSocial) {
      return res.status(404).send({ message: "Author_social topilmadi" });
    }

    res.send({
      message: "Author_social muvaffaqiyatli yangilandi",
      data: updatedSocial,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdAuthor_social = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const socialLink = await Author_social.findById(id).populate(
      "author_id social_id"
    );

    if (!socialLink) {
      return res.status(404).send({ message: "Author_social topilmadi" });
    }

    res.send(socialLink);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthor_social = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const deletedSocial = await Author_social.findByIdAndDelete(id);

    if (!deletedSocial) {
      return res.status(404).send({ message: "Author_social topilmadi" });
    }

    res.send({ message: "Author_social muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAuthor_social,
  getAuthor_social,
  updateAuthor_social,
  getByIdAuthor_social,
  deleteAuthor_social,
};
