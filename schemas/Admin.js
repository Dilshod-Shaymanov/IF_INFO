const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    is_active: { type: Boolean, required: true, trim: true },
    is_creator: { type: Boolean, required: true, trim: true },
    token: { type: String },
    activation_link: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("Admin", adminSchema);
