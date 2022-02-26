const PageModel = require("../models/Page");
const { SERVER_ERROR } = require("../message");

const createPage = async (req, res) => {
    try {
        let page = new PageModel(req.body);
        await page.save();
        res.json(page);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const updatePage = async (req, res) => {
    try {
        let pageId = req.params.id;
        let page = await PageModel.findOneAndUpdate({ _id: pageId }, { $set: req.body }, { new: true });
        if (!page) return res.status(400).send("Page not found");
        res.json(page);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const getPages = async (req, res) => {
    try {
        let { _id, userId } = req.query;
        if (!userId) res.status(400).send("UserId require");
        let query = { userId };
        if (Array.isArray(_id)) {
            query["_id"] = { $in: _id }
        }
        else if (_id) {
            query["_id"] = _id
        }
        let pages = await PageModel.find(query).lean();
        res.json(pages);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const deletePages = async (req, res) => {
    try {
        let { _id } = req.query;
        if (!_id || !_id.length) res.status(400).send("Page id require");
        let query = {};
        if (Array.isArray(_id)) {
            query["_id"] = { $in: _id }
        }
        else if (_id) {
            query["_id"] = _id
        }
        let pages = await PageModel.delete(query);
        res.json("Deleted successfully");
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

module.exports = {
    getPages,
    createPage,
    updatePage,
    deletePages
}