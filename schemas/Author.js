const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    nick_name: { type: String, required: true, trim: true, unique: true },
    email: { type: String, unique: true, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    info: { type: String, trim: true },
    position: { type: String, trim: true },
    photo: { type: String, required: true, trim: true },
    is_expert: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    token: { type: String },
    activation_link: String,
  },
  {
    versionKey: false,
  }
);
module.exports = model("Author", authorSchema);