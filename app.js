const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const joi = require('joi');

const expressError = require('./utils/ExpressError')
const videos = require ('./routes/video');
const comments = require ('./routes/comments');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mass-appeal';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));
//tell express to parse body so that post request from forms can go


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.use("/contact",videos);
app.use("/contact/:id/comments",comments);

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/videoupload', (req,res)=>{
    res.render('videoupload');
});



app.all('*', (req,res,next)=>{
    next(new expressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode =500} = err;
if (!err.message) err.message = "Oh something went wrong"
    res.status(statusCode).render('error', { err });
    
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})