const Joi = require("joi");

exports.userValidations = (data) => {
  const userSchema = Joi.object({
    name: Joi.string().required().trim().min(5).max(20),
    email: Joi.string().email().required().trim(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$]{6,30}$")),
    info: Joi.string(),
    photo: Joi.string().default("/user/my.png"),
    is_active: Joi.boolean().default(true).required(),
    token: Joi.string(),
    activation_link: Joi.string(),
  });
  return userSchema.validate(data, { abortEarly: false });
};
