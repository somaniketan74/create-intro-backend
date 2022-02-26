const { body, validationResult } = require('express-validator');
const { isUuid } = require('uuidv4');
class PageValidator {
    static postAPI = [
        body('title').notEmpty().withMessage("Title should not be empty").bail().isString().withMessage("Title should be string").bail(),
        body('userId').notEmpty().withMessage("UserId should not be empty").bail(),
        body('userId').custom(value => {
            if(value && value.length != 36) throw new Error('Invalid userId');
            return true;
        }),
        (req, res, next) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).send({...errors, message: "Invalid input"});
                }
                next();
            } catch (ex) {
                next(ex);
            }
        }
    ]
}

module.exports = PageValidator;