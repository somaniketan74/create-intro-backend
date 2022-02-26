const NotiModel = require("../models/Notification");
const { logger } = require("../logger");
const { SERVER_ERROR, MISSING_USER_ID, NOTIFICATION_DEFAULT_MESSAGE, NOTIFICATION_MESSAGE } = require("../message");

const saveNotification = async (data) => {
    try{
        logger.info("saveNotification", data);
        let notification = new NotiModel(data);
        notification = await notification.save();
        logger.info("saveNotification", "saved successfully");
        return notification;
    }
    catch(err){
        logger.error("saveNotification", (err)?err.stack:err);
    }
}

const getNotification = async (req, res) => {
    try{
        if(!req.query.userId) res.status(400).send(MISSING_USER_ID);
        let query = {};
        let page = req.query.page || 1;
        let limit = req.query.limit || 5;
        page = Number.parseInt(page);
        limit = Number.parseInt(limit);
        if(req.query.userId) query.userId = req.query.userId;
        let notification = await NotiModel.find(query).sort({createdAt: -1}).skip((page-1)*limit).limit(limit).lean();
        result = [];
        let notiId = [];
        if(notification && notification.length){
            notification.forEach((n) => {
                let message = NOTIFICATION_DEFAULT_MESSAGE;
                if(n.data && n.data.location){
                    message = NOTIFICATION_MESSAGE.format(n.data.location);
                }
                result.push(
                    {
                        read: n.read,
                        message
                    }
                );    
                notiId.push(n._id);
            });
        }
        await NotiModel.updateMany({_id:{$in:notiId}},{read:true});
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send(SERVER_ERROR);
    }
}

const getNotificationCount = async (req, res) => {
    try{
        if(!req.query.userId) res.status(400).send(MISSING_USER_ID);
        let query = {};
        if(req.query.userId) query.userId = req.query.userId;
        query["read"] = false;
        let count = await NotiModel.count(query);
        res.json(count);
    }
    catch(err){
        res.status(500).send(SERVER_ERROR);
    }
}

module.exports = {
    saveNotification,
    getNotification,
    getNotificationCount
}