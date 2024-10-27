const Joi = require("joi");

exports.adminValidations = (data) => {
  const adminSchema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().trim(),
    phone: Joi.string()
      .trim()
      .required()
      .pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$]{6,30}$"))
      .alphanum(),
    confirm_password: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .label("Tasdiqlash kodi noto'g'ri"),
    is_active: Joi.boolean().default(true),
    is_creator: Joi.boolean().default(true),
    token: Joi.string(),
    activation_link: Joi.string(),
  });
  return adminSchema.validate(data, { abortEarly: false });
};
