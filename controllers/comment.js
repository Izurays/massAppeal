const Video = require('../models/videoUpload');
const Comment = require('../models/comments');


module.exports.createComment = async(req,res)=>{
    const video = await Video.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    video.comments.push(comment);
    await comment.save();
    await video.save();
    req.flash('success', 'added a new comment');
    res.redirect(`/contact/${video._id}`)
};


module.exports.deleteComment = async(req,res)=>{
    const {id,commentid} =req.params;
    await Video.findByIdAndUpdate(id, {$pull: {comments: commentid}});
    await Comment.findByIdAndDelete(commentid);
    req.flash('success', 'successfully deleted comment')
    res.redirect(`/contact/${id}`);
};
