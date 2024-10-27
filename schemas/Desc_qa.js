const { Schema, model, Types } = require("mongoose");

const desc_qasChema = new Schema(
  {
    desc_id: { type: Types.ObjectId, ref: "Description" },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Desc_qa", desc_qasChema);
