const { Schema, model, Types } = require("mongoose");

const socialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    icon_file: { type: String, trim: true },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Social", socialSchema);
