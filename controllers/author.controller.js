const { errorHandler } = require("../helpers/error_handler");
const Author = require("../schemas/Author");
const mongoose = require("mongoose");
const { authorValidations } = require("../validations/author.validations");
const { hashSync, compareSync } = require("bcrypt");
const myJwt = require("../services/jwt_serves");
const { to } = require("../helpers/to_promise");
const { tokenSaveDb, setRefreshTokenCookie } = require("../helpers/token_save");
const uuid = require("uuid");
const mail_service = require("../services/mail_service");
const config = require("config");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidations(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const {
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      is_active,
    } = value;

    const old_author = await Author.findOne({
      first_name: new RegExp(first_name, "i"),
    });

    if (old_author) {
      return res.status(400).send({
        message: "Bunday author mavjud, iltimos boshqa author kiriting!",
      });
    }
    const hashed_password = hashSync(password, 7);
    const activation_link = uuid.v4();

    const newAuthor = await Author.create({
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password: hashed_password,
      info,
      position,
      photo,
      is_expert,
      is_active,
      activation_link,
    });
    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/author/activate/${activation_link}`
    );

    const payload = {
      _id: newAuthor._id,
      email: newAuthor.email,
      is_expert: newAuthor.is_expert,
    };
    const tokens = await tokenSaveDb(payload, newAuthor);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(201).send({
      message: "Author added!",
      id: newAuthor._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthor = async (req, res) => {
  try {
    const authors = await Author.find();
    if (!authors) {
      return res.status(400).send({ Error: "Birorta avtor topilmadi!" });
    }
    // throw Badrequest("Birorta avtor topilmadi!");

    res.send(authors);
  } catch (error) {
    errorHandler(res, error);
    // next(error)
  }
};

const getByIdAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    // console.log(req.author._id);
    if (id !== req.author._id) {
      return res
        .status(403)
        .send({ message: "Ruxsat etilmagan foydalanuvchi" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).send({ message: "Author topilmadi" });
    }

    res.send(author);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      first_name,
      last_name,
      nick_name,
      email,
      phone,
      password,
      info,
      position,
      photo,
      is_expert,
      is_active,
    } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        nick_name,
        email,
        phone,
        password,
        info,
        position,
        photo,
        is_expert,
        is_active,
      },
      { new: true }
    );

    if (!updatedAuthor) {
      return res.status(404).send({ message: "Author topilmadi" });
    }

    res.send({
      message: "Author muvaffaqiyatli yangilandi",
      data: updatedAuthor,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return res.status(404).send({ message: "Author topilmadi" });
    }

    res.send({ message: "Author muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }
    const validPassword = compareSync(password, author.password);

    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }

    const payload = {
      _id: author._id,
      email: author.email,
      is_expert: author.is_expert,
      author_roles: ["READ", "WRITE"], // "DELETE"
    };
    const tokens = await tokenSaveDb(payload, author);
    setRefreshTokenCookie(res, tokens.refreshToken);

    // try {
    //   setTimeout(() => {
    //     throw new Error("uncaughtExcetion example");
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    // new Promise((_,reject) => {
    //   reject(new Error("UnhandlerRejection example"))
    // })

    res.send({
      message: "User logged in successfully",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      return res
        .status(403)
        .send({ message: "Refresh token topilmadi Cookieda!" });
    }

    const [error, decodedToken] = await to(
      myJwt.verifyRefreshToken(refresh_token)
    );
    if (error) {
      return res.status(403).send({ message: error.message });
    }

    const authorFromDb = await Author.findOne({ token: refresh_token });
    if (!authorFromDb) {
      return res
        .status(403)
        .send({ message: "Ruxsat etilmagan foydalanuvchi (token mos emas" });
    }

    const payload = {
      _id: authorFromDb._id,
      email: authorFromDb.email,
      is_expert: authorFromDb.is_expert,
    };

    const tokens = await tokenSaveDb(payload, authorFromDb);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.send({
      message: "Token refreshed successfully",
      id: authorFromDb._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      return res.status(403).send({ message: "Refresh token not provided!" });
    }
    const author = await Author.findOneAndUpdate(
      { token: refresh_token },
      { token: "" },
      { new: true }
    );
    if (!author) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    res.clearCookie("refresh_token");
    res.send({
      message: "Successfully logged out",
      refreshToken: author.token,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};


const authorActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const author = await Author.findOne({ activation_link: link });
    if (!author) {
      return res.status(400).send({ message: "Bunday avtor topilmadi!" });
    }
    if (author.is_active) {
      return res.status(400)
        .send({ message: "Bu avtor avval faollashtirilgan" });
    }
    author.is_active = true;
    await author.save();
    res.send({is_active:author.is_active, message: "Avtor faollashtirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addAuthor,
  getAuthor,
  updateAuthor,
  getByIdAuthor,
  deleteAuthor,
  loginAuthor,
  logoutAuthor,
  refreshToken,
  authorActivate,
};
