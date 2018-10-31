if(process.env.NODE_ENV == "production"){
    module.exports = {
        mongoURL:"mongodb://test:test123456@ds127771.mlab.com:27771/idea-app"
    }
}else{
    module.exports = {
        mongoURL:"mongodb://localhost/node-app"
    }
}