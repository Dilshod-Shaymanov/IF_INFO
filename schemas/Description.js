const { Schema, model, Types } = require("mongoose");

const descriptionSchema = new Schema(
  {
    category_id: { type: Types.ObjectId, ref: "Category" },
    description: { type: String, trim: true },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Description", descriptionSchema);
