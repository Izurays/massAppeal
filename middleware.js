const express = require('express')
const expressError = require('./utils/ExpressError');
const {videoSchema,commentSchema} =require('./schemas');
const Video = require("./models/videoUpload");
const Comment = require('./models/comments');



module.exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status : 'fail',
          message : 'You dont have permession'
        });
      }
      next();
    };
  };
  



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateVideo = (req,res,next)=>{
    const { error } = videoSchema.validate(req.body);
    if (error){
        const msg =error.details.map(el => el.message).join(',')
        throw new express(msg, 400)
    }else{
        next();
    }
}

module.exports.isAuthor = async (req,res,next)=>{
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/contact/${video._id}`);
    }else {
        next();
    }

}

module.exports.isCommentAuthor = async (req,res,next)=>{
    const { id,commentid } = req.params;
    const comment = await Comment.findById(commentid);
    if(!comment.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/contact/${video._id}`);
    }else {
        next();
    }

}

module.exports.validateComment = (req,res,next)=>{
    const { error } = commentSchema.validate(req.body)
    if (error){
        const msg =error.details.map(el => el.message).join(',')
        throw new express(msg, 400)
    }else{
        next();
    }
}


