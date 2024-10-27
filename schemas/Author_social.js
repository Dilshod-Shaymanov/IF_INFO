const { Schema, model, Types } = require("mongoose");

const author_socialSchema = new Schema(
  {
    author_id: { type: Types.ObjectId, ref: "Author" },
    social_id: { type: Types.ObjectId, ref: "Social" },
    social_link: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Author_social", author_socialSchema);
