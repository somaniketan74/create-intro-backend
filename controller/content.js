const ContentModel = require("../models/Content");
const { SERVER_ERROR } = require("../message");

const createContent = async (req, res) => {
    try {
        let page = new ContentModel(req.body);
        await page.save();
        res.json(page);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const updateContent = async (req, res) => {
    try {
        let contentId = req.params.id;
        let content = await ContentModel.findOneAndUpdate({ _id: contentId }, { $set: req.body }, { new: true });
        if (!content) return res.status(400).send("Content not found");
        res.json(content);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const getContent = async (req, res) => {
    try {
        let { pageIds } = req.query;
        if(!pageIds) res.status(400).send("Page Id require");
        let query = {};
        if(Array.isArray(pageIds)){
            query["pageId"] = {$in:pageIds}
        }
        else if(pageIds) {
            query["pageId"] = pageIds
        }
        let contents = await ContentModel.find(query).lean();
        res.json(contents);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const deleteContent = async (req, res) => {
    try {
        let { _id } = req.query;
        if(!_id || !_id.length) res.status(400).send("Content id require");
        let query = {};
        if(Array.isArray(_id)){
            query["_id"] = {$in:_id}
        }
        else if(_id) {
            query["_id"] = _id
        }
        let contents = await ContentModel.delete(query);
        res.json("Content deleted successfully");
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

module.exports = {
    getContent,
    createContent,
    updateContent,
    deleteContent
}