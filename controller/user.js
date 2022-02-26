const UserModel = require("../models/User");
const PageModel = require("../models/Page");
const { MasterModel } = require("../models/Schemaless");
const { uuid } = require('uuidv4');
const { SERVER_ERROR, USER_NOT_FOUND } = require("../message");
const { logger } = require("../logger");
const { saveNotification } = require("./notification");
const createUser = async (req, res) => {
    try {
        let userData = req.body;
        //get username
        userData["username"] = await getUserName(userData.email);
        let user = new UserModel(req.body);
        await user.save();
        res.json(user);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const updateUser = async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await UserModel.findOneAndUpdate({ authUserId: userId }, { $set: req.body }, { new: true });
        if (!user) return res.status(400).send(USER_NOT_FOUND);
        res.json(user);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const getUser = async (req, res) => {
    try {
        let user = await UserModel.findOne({ authUserId: req.params.id }).lean();
        if (!user) return res.status(400).send(USER_NOT_FOUND);
        res.json(user);
    }
    catch (err) {
        res.status(500).send(SERVER_ERROR);
    }
}

const getUserName = async (email) => {
    try {
        if (!email) throw new Error("Email id require");
        logger.info("getUserName", {email});
        let emailPrefix = email.substring(0, email.lastIndexOf("@"));
        let result = emailPrefix;
        logger.info("getUserName", {result});
        while (1) {
            //Check user exists with userName
            let user = await UserModel.findOne({ username: result }).lean();
            if (user) {
                logger.info("getUserName", "Username already available");
                let masterObj = await MasterModel.findOneAndUpdate({ sequence: { $exists: true } }, { $inc: { sequence: 1 } }, { new: true, lean: true });
                result = emailPrefix + "_" + masterObj.sequence;
                logger.info("getUserName", { result });
            }
            else break;
        }
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
}
const userPublicInfo = async (req, res) => {
    try{
        let username = req.params.username;
        let query = req.query;
        logger.info("userPublicInfo", username);
        let user = await UserModel.findOne({username}).lean();
        logger.info("userPublicInfo", user);
        if(!user) res.status(400).send(USER_NOT_FOUND);
        let pageAggregate = [
            { "$match": { userId: user.authUserId, deleted: false } },
            { "$lookup": {
                    "from": "contents",
                    "localField": "_id",
                    "foreignField": "pageId",
                    "as": "contents"
                }
            }
        ];
        logger.info("userPublicInfo", pageAggregate);
        let pages = await PageModel.aggregate(pageAggregate);
        logger.info("userPublicInfo", pages);
        if(pages && Array.isArray(pages)){
            pages.forEach((p) => {
                if(p.contents && Array.isArray(p.contents)){
                    p.contents = p.contents.filter((c) => {
                        return !c.deleted;
                    });    
                }
            });
        }
        let data = { user, pages };
        saveNotification({userId: user.authUserId, data: query});
        res.status(200).send(data);
    }
    catch(err){
        res.status(500).send(SERVER_ERROR);
    }
}
module.exports = {
    createUser,
    updateUser,
    getUser,
    userPublicInfo
}