const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require ('./models/user');
const {isLoggedIn} = require('./middleware');
const Video = require('./models/videoUpload');


const expressError = require('./utils/ExpressError')
const videosRoutes = require ('./routes/video');
const commentsRoutes = require ('./routes/comments');
const userRoutes = require ('./routes/user');
const catchAsync = require("./utils/catchAsync");

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

const sessionConfig = {
    secret:'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use("/contact",videosRoutes);
app.use("/contact/:id/comments",commentsRoutes);




app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/videoupload',isLoggedIn,catchAsync(async(req,res)=>{
    const video = new Video(req.body.video);
    video.author=req.user._id;
    if(req.user.username ==='Admin'){
        res.render('videoupload');
        req.flash('success','Welcome Admin')
    }else{
        req.flash('error','You do not have admin privillages')
        res.redirect('/contact')
    }
    
}));



app.all('*', (req,res,next)=>{
    next(new expressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode =500} = err;
if (!err.message) err.message = "Oh something went wrong"
    res.status(statusCode).render('error', { err });
    
})

const port = process.env.PORT || 3000;0    
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})