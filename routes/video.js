const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/ExpressError')
const Video = require("../models/videoUpload");
const {videoSchema} =require('../schemas')


const validateVideo = (req,res,next)=>{
    const { error } = videoSchema.validate(req.body);
    if (error){
        const msg =error.details.map(el => el.message).join(',')
        throw new express(msg, 400)
    }else{
        next();
    }
}

router.get('/', async (req,res)=>{
    const videos = await Video.find({});
    res.render('contact', { videos });
});



router.post('/',validateVideo, catchAsync (async (req,res, next)=>{
    //if (!req.body.video) throw new expressError('invalid video data', 400)
        const video = new Video(req.body.video);
        await video.save()
        res.redirect(`/contact/${video._id}`);    
  }));
  

router.get('/:id',catchAsync( async (req,res)=>{
    const video = await Video.findById(req.params.id).populate('comments');
    res.render('showVideo', { video });
}))
router.get('/:id/editVideo',catchAsync (async(req,res)=>{
    const video = await Video.findById(req.params.id);
    res.render('editVideo', { video });
}))
router.put('/:id',validateVideo, catchAsync (async (req,res)=>{
    const {id} = req.params;
    const video = await  Video.findByIdAndUpdate(id,{...req.body.video});
    res.redirect(`/contact/${video._id}`);
}))
router.delete('/:id', catchAsync (async(req,res)=>{
    const {id} = req.params;
    await Video.findByIdAndDelete(id,{...req.body.video});
    res.redirect('/contact');

}))

module.exports = router;
