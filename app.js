const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const app = express();
const db = require("./config/database")
//Connect to mongoose
mongoose.connect(db.mongoURL, {useNewUrlParser:true })
    .then(()=>{
        console.log("MongoDB connected!")
    })
    .catch((err)=>{

    })

//引入模型
// require("./models/Idea");
// const Idea = mongoose.model('ideas');
//load route
const ideas = require('./routes/ideas');
const users = require('./routes/users');

require('./config/passport')(passport);

//配置端口号
const PORT = process.env.PORT || 5000; 

//handlebars middleware
app.engine('handlebars',exphbs({
    defaultLayout: 'main'
}))
app.set('view engine','handlebars');

//使用静态文件
app.use(express.static(path.join(__dirname,'public')));
//body-parser middleware
// var joinParser = bodyParser.json();
// var urlencodeParser = bodyParser.urlencoded({extended: false});

//method-override middleware
app.use(methodOverride('_method'));

//session & flash middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

//配置全局变量
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//配置路由
app.get("/",(req,res)=>{
    let title = "大家好，我是米斯特张"
    res.render("index",{
        title
    });
})


app.use('/ideas',ideas);
app.use('/users',users);
//about
app.get("/about",(req,res)=>{
    res.render("about");
})
app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`);
})