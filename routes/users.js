const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport')
const router = express.Router();

//引入模型
require("../models/user");
const User = mongoose.model('users');

//body-parser middleware
var joinParser = bodyParser.json();
var urlencodeParser = bodyParser.urlencoded({extended: false});

//login & register
//登录页
router.get("/login",(req,res)=>{
    res.render("users/login");
})

//注册页
router.get("/register",(req,res)=>{
    res.render("users/register");
})

//注册
router.post("/register",urlencodeParser,(req,res)=>{
    // console.log(req.body)
    let errors = [];
    if(req.body.username == ""){
        errors.push({
            text: "用户名不能为空！"
        })
    }
    if(req.body.password != req.body.password2){
        errors.push({
            text: "两次密码输入不一致！"
        })
    }
    if(req.body.password.length < 4){
        errors.push({
            text: "密码长度不能小于4"
        })
    }

    if(errors.length>0){
        res.render("users/register",{
            errors: errors,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }else{
       
        //判断email数据库中是否存在
        User.findOne({email: req.body.email})
            .then((user) =>{
                if(user){
                    req.flash("error_msg","邮箱已被注册，请更换邮箱！");
                    res.redirect("/users/register");
                }else{
                    const newUser = new User({
                        username: req.body.username,
                        email:req.body.email,
                        password:req.body.password
                    })
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            // Store hash in your password DB.
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                            .then((user) =>{
                                req.flash("success_msg","账号注册成功！");
                                res.redirect("/users/login");
                            }).catch((err) =>{
                                req.flash("error_msg","账号注册失败！");
                                res.redirect("/users/register");
                            })
                        });
                    });
                    
                }
            })
    }
   
})

//退出
router.get("/logout",(req,res) =>{
    req.logout();
    req.flash("success_msg","退出登录成功！");
    res.redirect("/users/login");
})
//登录页
router.post("/login",urlencodeParser,(req,res,next)=>{
    // console.log(req.body)
    //使用passport验证
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)

    
})
module.exports = router;