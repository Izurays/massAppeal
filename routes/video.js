const express = require('express');
const router = express.Router();
const videos = require("../controllers/video")
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/ExpressError')
const Video = require("../models/videoUpload");

const { isLoggedIn,isAuthor,validateVideo } = require('../middleware');

router.route('/')
      .get(catchAsync (videos.index))
      .post(isLoggedIn,validateVideo, catchAsync (videos.uploadVideo));

router.route('/:id')
       .get(isLoggedIn, catchAsync(videos.showVideo))
       .put(isLoggedIn, isAuthor, validateVideo, catchAsync (videos.updateVideo))
       .delete(isLoggedIn,isAuthor, catchAsync (videos.deleteVideo));

  
router.get('/:id/editVideo',isLoggedIn, isAuthor, catchAsync (videos.renderEditForm));

module.exports = router;
