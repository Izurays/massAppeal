const mongoose = require('mongoose');
const title = require('./title');
const description = require('./description');
const Video = require('../models/videoUpload');
//const dbUrl= process.env.DB_URL;

mongoose.connect('mongodb://localhost:27017/mass-appeal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Video.deleteMany({});
    for (let i = 0; i < 4; i++) {
        const random4 = Math.floor(Math.random() * 4);
      
            
        const video = new Video({
            //YOUR USER ID
            author:"638264373b72517c398e04b1",
            title: `${title[random4].title}`,
            description: `${description[random4].description}`,
            video:"./videos/video1.mp4",
            
        })
        await video.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
