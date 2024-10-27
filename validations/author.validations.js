const Joi = require("joi");
const fullName = (parent) => {
  return parent.first_name + " " + parent.last_name;
};

exports.authorValidations = (data) => {
  const schemaAuthor = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    full_name: Joi.string().default(fullName),
    nick_name: Joi.string().min(4).max(20),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$]{6,30}$")),
    confirm_password: Joi.ref("password"),
    email: Joi.string().email().lowercase(),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    info: Joi.string(),
    position: Joi.string(),
    photo: Joi.string().default("/author/avatar.png"),
    is_expert: Joi.boolean().default(false),
    is_avtive: Joi.boolean().default(false),
    token: Joi.string(),
    activation_link: Joi.string(),
    // gender: Joi.string().valid("erkak", "ayol"),
    // birth_day: Joi.date()
    //   .less(new Date("2010-01-01"))
    //   .greater(new Date("2000-01-01")),
    // birth_year: Joi.number().integer().min(1980).max(2005),
    // referred: Joi.boolean().default(false),
    // refereedDatelis: Joi.string().when("referred", {
    //   is: true,
    //   then: Joi.string().required(),
    //   otherwise: Joi.string().optional(),
    // }),
    // coding_langs: Joi.array().items(Joi.string(), Joi.number()),
    // is_yes: Joi.boolean().truthy("YES", "HA").valid(true),
  });
  return schemaAuthor.validate(data, { abortEarly: false });
};

