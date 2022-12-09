const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/ExpressError')
const { validateComment,isLoggedIn,isCommentAuthor, isAdmin } = require('../middleware');
const comment = require('../controllers/comment')


router.post('/',isLoggedIn, validateComment, catchAsync(comment.createComment));

router.delete('/:commentid',isLoggedIn,isCommentAuthor, catchAsync(comment.deleteComment));


module.exports = router;