const express = require("express");
const path = require("path");
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"/views"));

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/contact',(req,res)=>{
    res.render('contact');
});
app.get('/videoupload', (req,res)=>{
  res.render('videoupload');
});




const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})