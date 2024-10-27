const { Schema, model, Types } = require("mongoose");

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    parent_category_id: { type: Types.ObjectId, ref: "Category" },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Category", categorySchema);
