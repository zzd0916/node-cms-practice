const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
//引入模型
require("../models/Idea");
const Idea = mongoose.model('ideas');

//body-parser middleware
var joinParser = bodyParser.json();
var urlencodeParser = bodyParser.urlencoded({extended: false});

//编辑
router.get("/edit/:id",ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(( idea=> {
        //判断用户是否正确
        if(idea.user != req.user.id){
            req.flash("error_msg","非法操作~！");
            res.redirect("/ideas");
        }else{
            res.render("ideas/edit",{
                idea:idea
            });
        }
    }))
})

//添加页面
router.get("/add",ensureAuthenticated,(req,res)=>{
    res.render("ideas/add");
})
router.get("/",ensureAuthenticated,(req,res)=>{
    Idea.find({user:req.user.id})
        .sort({date:"desc"})
        .then((idea)=>{
            res.render("ideas/index",{
                ideas:idea
            });
        })
    
})

//添加
router.post("/",urlencodeParser,(req,res)=>{
    //console.log(req.body)
    let errors = [];//错误信息
    if(!req.body.title){
        errors.push({text:"请输入标题！"})
    }
    if(!req.body.details){
        errors.push({text:"请输入详情！"})
    }

    if(errors.length > 0){
        res.render("ideas/add",{
            errors: errors,
            title: req.body.title,
            details: req.body.details,
        });
    }else{
        const newUser ={
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        }
        new Idea(newUser)
            .save()
            .then((idea)=>{
                req.flash("success_msg","数据添加成功！")
                res.redirect("/ideas");
            })
    }
})

//更新
router.put("/:id",urlencodeParser,function(req,res){
    Idea.findOne({
        _id: req.params.id
    })
    .then((idea)=>{
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea=>{
                req.flash("success_msg","数据编辑成功！")
                res.redirect("/ideas")
            })
    })
})

//删除
router.delete("/:id",ensureAuthenticated,function(req,res){
   Idea.deleteOne({
       _id: req.params.id
   })
   .then(()=>{
       req.flash("success_msg","数据删除成功！")
       res.redirect("/ideas");
   })
})

module.exports = router;