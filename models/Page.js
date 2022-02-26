const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const PageSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true},
  title: { type: String, required: true},
  description: { type: String}
}, { timestamps: true });

PageSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });
const Page = mongoose.model("Pages", PageSchema);

module.exports = Page;
