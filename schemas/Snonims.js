const { Schema, model, Types } = require("mongoose");

const snonimSchema = new Schema(
  {
    desc_id: { type: Types.ObjectId, ref: "Description" },
    dict_id: { type: Types.ObjectId, ref: "Dictionary" },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Snonim", snonimSchema);
