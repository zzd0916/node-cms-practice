const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//加载model
const User = mongoose.model('users');

module.exports = (passport) =>{
    passport.use(new LocalStrategy(
       {usernameField: "email"},
       (email,password,done) =>{
            //数据库查询
            User.findOne({
                email:email
            }).then((user)=>{
                if(!user){
                  return done(null, false, {message:"没有这个用户!"})
                }
                //验证密码
                bcrypt.compare(password, user.password, function(err, isMatch) {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user)
                    }else{
                        return done(null, false, {message:"密码错误！!"})
                    }
                });
            })
       }
    ));
    
    //序列化和反序列化
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
       
    passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
    });
}