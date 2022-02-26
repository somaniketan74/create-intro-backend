const mongoose = require("mongoose");
const noSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
var MasterModel = mongoose.model('master', noSchema, 'master');
module.exports = {
    MasterModel
}