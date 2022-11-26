const mongoose = require('mongoose');
const Comment = require('./comments');
const Schema = mongoose.Schema;


const VideoSchema = new Schema({
    title: String,
    description: String,
    video:String,
    comments: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Comment'
        }
       
    ]
    
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