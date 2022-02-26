const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const ContentSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Pages", index: true},
  short_description: { type: String, required: true},
  type: { type: String, enum:["pdf", "youtube", "vimeo", "link", "text", "image"] },
  data: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

ContentSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });
const Content = mongoose.model("Content", ContentSchema);

module.exports = Content;
