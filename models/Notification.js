const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true},
  read: { type: Boolean, default: false },
  data: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

NotificationSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });
const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
