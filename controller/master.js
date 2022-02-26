const { SERVER_ERROR } = require("../message");
const { MasterModel } = require("../models/Schemaless");
const getCategories = async (req, res) => {
    try{
        let masterData = await MasterModel.findOne({}).lean();
        let { categories } = masterData;
        res.json(categories);
    }
    catch(err){
        res.status(500).send(SERVER_ERROR);
    }
}

module.exports = {
    getCategories    
}