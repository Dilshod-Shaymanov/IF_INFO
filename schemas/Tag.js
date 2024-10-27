const { Schema, Types, model } = require("mongoose");

const tagSchema = new Schema(
  {
    topic_id: { type: Types.ObjectId, ref: "Topic" },
    category_id: { type: Types.ObjectId, ref: "Category" },
  },
  { versionKey: false }
);

module.exports = model("Tag", tagSchema);
