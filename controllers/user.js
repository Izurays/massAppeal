const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req,res,next)=>{
    try{
        const { email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err =>{
            if (err) return next(err);
            req.flash("success",'welcome to mass appeal');
            res.redirect('/contact');
        });
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = async(req,res)=>{
    req.flash('success',"welcome back");
    const redirectUrl =req.session.returnTo || '/contact';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    
};


module.exports.logout = function(req, res, next) {
    req.logout(function(err) {  // do this
      if (err) { return next(err); }// do this
      req.flash('success',"goodbye");
      res.redirect('/');
    });
  };