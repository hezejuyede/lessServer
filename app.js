const express = require("express");                          //引入express框架
const app = express();                                       //实例化express


app.use(express.static("./public"));                             //静态PUBLIC
app.use(express.static("./static"));                             //静态static


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});                                                                //服务端解决跨域


app.listen(3001);                                                 //监听3000端口

console.log("SERVER START");                                     //控制台打印服务器成功启动信息