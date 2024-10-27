const { Schema, model } = require("mongoose");

const dictionarySchema = new Schema(
  {
    term: { type: String, required: true, trim: true, unique: true },
    letter: { type: String, uppercase: true },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Dictionary", dictionarySchema);
