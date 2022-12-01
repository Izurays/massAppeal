const mongoose = require('mongoose');
const Comment = require('./comments');
const Schema = mongoose.Schema;


const VideoSchema = new Schema({
    title: String,
    description: String,
    videopath:String,
    comments: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Comment'
        }
       
    ],
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
    
});
VideoSchema.post('findOneAndDelete', async function(doc){
   if(doc){
    await Comment.deleteMany({
        _id: {
            $in: doc.comments
        }
    })
   }
})


module.exports = mongoose.model('Video', VideoSchema);