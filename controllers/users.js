const User= require("../models/user.js");

//render signup form
module.exports.renderSignupForm= (req,res)=>{
    res.render("users/signup.ejs");
};

//posting the signup data or registering
module.exports.signup  =async(req,res)=>{
    try{
    
        let{username,email,password}=req.body;
        const newUser= new User({email,username});
        const registeredUser= await User.register(newUser,password);
        console.log(registeredUser);
        //as user get registered then automatically login
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }      
            
            req.flash("success","Welcome to Wanderlust!");
            res.redirect('/listings');
        });
    }
    
    catch(e){
         req.flash("error",e.message);
         res.redirect("/signup");  
    }
};

//rendering login form
module.exports.renderLoginForm =(req,res)=>{
    res.render("users/login.ejs");
};    

//successfull login route
module.exports.login =async(req,res)=>{
    req.flash("success","Welcome to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings"  ;
    res.redirect(redirectUrl);
};

//logout route
module.exports.logout= (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};  