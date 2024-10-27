const { Schema, model } = require("mongoose");

const guestSchema = new Schema(
  {
    ip: { type: String, required: true, trim: true },
    os: { type: String, required: true, trim: true },
    device: { type: String, required: true, trim: true },
    browser: { type: String, required: true, trim: true },
    reg_date: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

module.exports = model("Guest", guestSchema);
