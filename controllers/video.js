const Video = require('../models/videoUpload');


module.exports.index = async (req,res)=>{
    const videos = await Video.find({});
    res.render('contact', { videos });
}


module.exports.uploadVideo = async (req,res, next)=>{
    const video = new Video(req.body.video);
    video.author=req.user._id;
    await video.save()
    req.flash("success","Succesfully uploaded a new video");
    res.redirect(`/contact/${video._id}`);    
}

module.exports.showVideo = async (req,res)=>{
    const video = await Video.findById(req.params.id).populate({
        path:'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!video){
        req.flash('error','that video does not exist');
        return res.redirect('/contact');
    }
    res.render('showVideo', { video});
}

module.exports.renderEditForm = async(req,res)=>{
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video){
        req.flash('error','that video does not exist');
        return res.redirect('/contact');
    }
    res.render('editVideo', { video });
}

module.exports.updateVideo = async (req,res)=>{
    const {id} = req.params;
    
    const videos = await  Video.findByIdAndUpdate(id,{...req.body.video});
    req.flash('success','successfully updated video');
    res.redirect(`/contact/${videos._id}`);
}

module.exports.deleteVideo = async(req,res)=>{
    const {id} = req.params;
    await Video.findByIdAndDelete(id,{...req.body.video});
    req.flash('success','succesfully deleted video');
    res.redirect('/contact');

}