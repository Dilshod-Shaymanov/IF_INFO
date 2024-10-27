const { Schema, model, Types } = require("mongoose");

const topicSchema = new Schema(
  {
    author_id: { type: Types.ObjectId, ref: "Author" },
    topic_title: { type: String, required: true },
    topic_text: { type: String, required: true },
    created_date: { type: Date, default: new Date() },
    updated_date: { type: Date, required: true },
    is_checked: { type: Boolean, required: true },
    is_approved: { type: Boolean, required: true },
    expert_id: { type: Types.ObjectId, ref: "Author" },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Topic", topicSchema);
