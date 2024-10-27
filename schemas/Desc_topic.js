const { Schema, model, Types } = require("mongoose");

const desc_topicSchema = new Schema(
  {
    desc_id: { type: Types.ObjectId, ref: "Description" },
    topic_id: { type: Types.ObjectId, ref:"Topic" },
  },
  {
    versionKey: false,
  }
);

module.exports = model("Desc_topic", desc_topicSchema);
