const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)


//const joi = require('joi');

module.exports.videoSchema = joi.object({
    
        video:joi.object({
            title:joi.string().required().escapeHTML(),
            description:joi.string().required().escapeHTML(),
            videopath:joi.string().required().escapeHTML()
        }).required()
    
});

module.exports.commentSchema = joi.object({
    comment: joi.object({
        rating:joi.number().required().min(1).max(5) ,
        body:joi.string().required().escapeHTML()
    }).required()
})