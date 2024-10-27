const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unuque: true },
    password: { type: String, required: true, trim: true },
    info: { type: String, required: true, trim: true },
    photo: { type: String, trim: true },
    is_active: { type: Boolean },
    token: String,
    activation_link: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
