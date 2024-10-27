const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../schemas/Admin");
const mongoose = require("mongoose");
const { adminValidations } = require("../validations/admin.validations");
const { hashSync, compareSync } = require("bcrypt");
const myJwt = require("../services/jwt_serves");
const { to } = require("../helpers/to_promise");
const { tokenSaveDb, setRefreshTokenCookie } = require("../helpers/token_save");
const uuid = require("uuid");
const config = require("config");
const mail_service = require("../services/mail_service");

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidations(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }
    const { name, email, phone, password, is_active, is_creator } = value;
    const admin = await Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .send({ message: "Bunday admin allaqachon mavjud" });
    }

    const hash_password = hashSync(password, 7);
    const activation_link = uuid.v4();

    const newAdmin = await Admin.create({
      name,
      email,
      phone,
      password: hash_password,
      is_active,
      is_creator,
      activation_link,
    });
    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get( "port")}/api/admin/activate/${activation_link}`
    );

    const payload = {
      adminId: newAdmin._id,
      phone: newAdmin.phone,
      email: newAdmin.email,
    };
    const tokens = tokenSaveDb(payload, newAdmin);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(201).send({
      message: "Yangi Admin muvaffaqiyatli qo'shildi!",
      id: newAdmin._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (!admins) {
      return res.status(403).send({ message: "Bitta ham admin topilmadi! " });
    }

    res.send(admins);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getByIdAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id != req.admin.id) {
      return res
        .status(403)
        .send({ message: "Ruxsat etilmagan foydalanuvchi" });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }
    res.send(admin);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { error, value } = adminValidations(req.body);

    if (error) {
      return res.status(400).send({ error: error.message });
    }

    const { name, email, phone, password, is_active, is_creator } = value;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { name, email, phone, password, is_active, is_creator },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    res.send({
      message: "Admin muvaffaqiyatli yangilandi",
      data: updatedAdmin,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Noto'g'ri ID" });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    res.send({ message: "Admin muvaffaqiyatli o'chirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }
    const validPassword = compareSync(password, admin.password);

    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }

    const payload = {
      id: admin._id,
      email: admin.email,
      phone: admin.phone,
    };
    const tokens = tokenSaveDb(payload, admin);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).send({
      message: "Admin loged in successfully",
      id: admin._id,
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
    const adminFromDb = await Admin.findOne({ token: refresh_token });
    // console.log(adminFromDb);
    if (!adminFromDb) {
      return res
        .status(403)
        .send({ message: "Ruxsat etilmagan admin (token mos emas" });
    }
    const payload = {
      id: adminFromDb._id,
      email: adminFromDb.email,
      phone: adminFromDb.phone,
    };
    const tokens = tokenSaveDb(payload, adminFromDb);
    setRefreshTokenCookie(res, tokens.refreshToken);

    res.send({
      message: "Token refreshed successfully",
      id: adminFromDb._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.status(403).send({ message: "Cookie allaqachon tozalangan" });
    }
    const admin = await Admin.findOneAndUpdate(
      { token: refresh_token },
      { token: "" },
      { new: true }
    );
    if (!admin) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    res.clearCookie("refresh_token");
    res.send({ refresh_token: admin.token });
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
      return res.status(403).send({ message: error.message });
    }
    return res.send(decodedToken);
  } catch (error) {
    errorHandler(res, error);
  }
};


const adminActivate = async(req,res) => {
  try {
    const link = req.params.link;
    const admin = await Admin.findOne({activation_link:link});
    // console.log(admin);
    if(!admin) {
      return res.status().send({message:"Bunday admin topilmadi"});
    }
    if(admin.is_active) {
      return res.status(400).send({message:"Bu admin avval faollashtirilgan!"})
    }
    admin.is_active = true;
    await admin.save();
    res.send({message:"Admin faollashtirildi",is_active:admin.is_active});

  } catch (error) {
    errorHandler(res,error)
  }
}


module.exports = {
  addAdmin,
  getAdmin,
  updateAdmin,
  getByIdAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  testToken,
  refreshToken,
  adminActivate
};
