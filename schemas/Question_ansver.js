const { Schema, Types, model } = require("mongoose");

const quesSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    created_date: { type: Date, default: new Date(), required: true },
    updated_date: { type: Date, required: true },
    is_checked: { type: Boolean, required: true },
    user_id: { type: Types.ObjectId, ref: "User", required: true },
    expert_id: { type: Types.ObjectId, ref: "Author", required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Question_Answer", quesSchema);
