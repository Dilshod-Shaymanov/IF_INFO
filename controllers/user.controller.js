const { errorHandler } = require("../helpers/error_handler");
const User = require("../schemas/User");
const mongoose = require("mongoose");
const { userValidations } = require("../validations/user.validations");
const { compareSync, hashSync } = require("bcrypt");
const config = require("config");
const myJwt = require("../services/jwt_serves");
const { to } = require("../helpers/to_promise");
const { tokenSaveDb, setRefreshTokenCookie } = require("../helpers/token_save");
const uuid = require("uuid");
const mail_service = require("../services/mail_service");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidations(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    const { name, email, password, info, photo, is_active } = value;

    const old_user = await User.findOne({ email });
    if (old_user) {
      return res.status(400).send({ message: "Bunday user mavjud" });
    }
    const hash_password = hashSync(password, 7);
    const activation_link = uuid.v4();

    const newUser = await User.create({
      name,
      email,
      password: hash_password,
      info,
      is_active,
      photo,
      activation_link,
    });
    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/user/activate/${activation_link}`
    );

    const payload = {
      name: newUser.name,
      email: newUser.email,
      photo: newUser.photo,
    };
    const tokens = tokenSaveDb(payload, newUser);
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.status(201).send({
      message: "User muvaffaqiyatli qo'shildi",
      id: newUser._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { error, value } = userValidations(req.body);

    if (error) {
      return res.status(400).send({ error: error.message });
    }
    const { name, email, password, info, photo, is_active } = value;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, info, photo, is_active },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User topilmadi" });
    }

    res.send({
      message: "User muvaffaqiyatli yangilandi",
      data: updatedUser,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (id != req.user.id) {
      return res.status(403).send({ message: "Kirish mumkin emas!" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: "User topilmadi" });
    }

    res.send(user);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Incorrect ObjectId" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({ message: "User topilmadi" });
    }

    res.send({ message: "User muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await User.findOne({ email });

    if (!newUser) {
      return res.status(400).send({ message: "User or Password Incorrect" });
    }
    const validPassword = compareSync(password, newUser.password);
    if (!validPassword) {
      return res.status(400).send({ message: "User or Password Incorrect" });
    }
    const payload = {
      id: newUser._id,
      name: newUser.name,
      photo: newUser.photo,
      info: newUser.info,
    };
    const tokens = tokenSaveDb(payload, newUser);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).send({
      message: "User loged in successfully",
      id: newUser._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const ref_token = req.cookies.refresh_token;
    if (!ref_token) {
      return res
        .status(403)
        .send({ message: "Refresh token topilmadi Cookieda" });
    }
    const [error, decodedToken] = await to(myJwt.verifyRefreshToken(ref_token));

    if (error) {
      return res.status(403).send({ message: error.message });
    }
    const userFromDb = await User.findOne({ token: ref_token });
    if (!userFromDb) {
      return res
        .status(403)
        .send({ message: "Ruxsat etilmagan foydalanuvchi (token mos emas)" });
    }
    const payload = {
      id: userFromDb._id,
      name: userFromDb.name,
      photo: userFromDb.photo,
      info: userFromDb.info,
    };
    const tokens = tokenSaveDb(payload, userFromDb);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.send({
      message: "Token refreshed successfully",
      id: userFromDb._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutUser = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.status(403).send({ message: "Cookie allaqachon tozalangan" });
    }
    const user = await User.findOneAndUpdate(
      { token: refresh_token },
      { token: "" },
      { new: true }
    );
    if (!user) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    res.clearCookie("refresh_token");
    res.status(200).send({
      message: "Admin muvaffaqiyatli tizimdan chiqdi!",
      refresh_token: user.token,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const testToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      return res.status(400).send({ message: "Token topilmadi!" });
    }

    const [error, decodedToken] = await to(
      myJwt.verifyRefreshToken(refresh_token)
    );
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    return res.send(decodedToken);
  } catch (error) {
    errorHandler(res, error);
  }
};

const userActivate = async function (req, res) {
  try {
    const { link } = req.params;
    const user = await User.findOne({ activation_link: link });
    if (!user) {
      return res.status(400).send({ message: "Bunday user topilmadi!" });
    }
    if (user.is_active) {
      return res
        .status(400)
        .send({ message: "Bu user avval faollashtirilgan" });
    }
    user.is_active = true;
    await user.save();
    return res.status(200).send({
      message: "User faollashtirildi",
      is_active: user.is_active,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addUser,
  getUser,
  updateUser,
  getByIdUser,
  deleteUser,
  loginUser,
  logoutUser,
  testToken,
  refreshToken,
  userActivate,
};
