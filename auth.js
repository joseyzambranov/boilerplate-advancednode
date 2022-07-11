const passport = require('passport');

module.exports = function (app,myDataBase){

    passport.authenticate("local",{failureRedirect:"/"}),(req,res,next)=>{
        res.redirect("/profile")
      }

}