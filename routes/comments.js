const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/ExpressError')
const Video = require("../models/videoUpload");
const Comment = require('../models/comments');
const {commentSchema} =require('../schemas')



const validateComment = (req,res,next)=>{
    const { error } = commentSchema.validate(req.body)
    if (error){
        const msg =error.details.map(el => el.message).join(',')
        throw new express(msg, 400)
    }else{
        next();
    }
}


router.post('/',validateComment, catchAsync(async(req,res)=>{
    const video = await Video.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    video.comments.push(comment);
    await comment.save();
    await video.save();
    res.redirect(`/contact/${video._id}`)
}))

router.delete('/:commentid', catchAsync(async(req,res)=>{
    const {id,commentid} =req.params;
    await Video.findByIdAndUpdate(id, {$pull: {comments: commentid}});
    await Comment.findByIdAndDelete(commentid);
    res.redirect(`/contact/${id}`);
}))

module.exports = router;