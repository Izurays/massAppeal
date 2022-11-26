const joi = require('joi');

module.exports.videoSchema = joi.object({
    
        video:joi.object({
            title:joi.string().required(),
            description:joi.string().required()
        }).required()
    
});

module.exports.commentSchema = joi.object({
    comment: joi.object({
        rating:joi.number().required().min(1).max(5) ,
        body:joi.string().required()
    }).required()
})