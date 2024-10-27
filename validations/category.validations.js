const Joi = require("joi");

exports.categoryValidation = (data) => {
  const schemaCategory = Joi.object({
    name: Joi.string()
      .min(2)
      .message("Category nomi ikkita ta hardan uzun bo'lish kerak")
      .max(100)
      .required()
      .messages({
        "string.empty": "Category nomi bo'sh bo'lishi mumkin emas",
        "any.required": "Category nomi albatta kiritish shart",
      }),
    parent_category_id: Joi.string().alphanum().message("Id noto'g'ri"),
  });
  return schemaCategory.validate(data, { abortEarly: false });
};

