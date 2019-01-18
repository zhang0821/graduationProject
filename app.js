var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var favicon = require('serve-favicon');
// var MongoClient = require('mongodb').MongoClient;
// //确定数据库名称vuetest
// var mongoUrl = 'mongodb://localhost:27017/vuetest';
// var _db;
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('dist'));

app.use('/', require("./routes/users")); //主路由
app.use('/config', require("./routes/saveConfig")); //组态页面设计路由
app.use('/pageInit',require("./routes/pageInit"));//初始数据获取


// MongoClient.connect(mongoUrl, function (err, db) {
//   if(err) {
//     console.error(err);
//     return;
//   }
//   console.log('mongodb have connected your project');
//   _db = db;
//   //监听端口8080
//   app.listen(8080, function () {
//     console.log('server is running at 8080');
//   });
// });

//增加书籍
// app.post('/createBook', function(req, res, next) {
// var request = req.body;
// console.log('进入createBOOK请求')
// // var collection = _db.collection('book');
// // if(!request.name || !request.teacher || !request.introduction || !request.shopUrl || !request.pictureUrl) {
// //   res.send({errcode:-1,errmsg:"参数不完整"});
// //   return;
// // }
// // collection.insert({name: request.name, teacher: request.teacher,introduction: request.introduction,shopUrl: request.shopUrl,pictureUrl: request.pictureUrl,}, function (err, ret) {
// //   if(err) {
// //     console.error(err);
// //     res.status(500).end();
// //   } else {
// //     res.send({errcode:0,errmsg:"ok"});
// //   }
// // });


// });


// // app.use('/login', proxy({

// //   target: "http://localhost",
  
// //   changeOrigin:true}));

// //获取书籍列表
// app.get('/book-list', function(req, res, next) {
//   console.log('进入book-list函数')
//   var ret={
//     data:'hello',
//     flag:1
//   }
//   res.json(ret);
//   // var collection = _db.collection('book');
//   // collection.find({}).toArray(function (err, ret) {
//   //   if(err) {
//   //     console.error(err);
//   //     return;
//   //   }
//   //   res.json(ret);
//   // });
// });

// app.get('/login', function(req, res, next){
//   res.send({
//     data:"hello"
//   })
// });


// app.get('/test', function(req, res, next){
//   res.send({
//     data:hello
//   })
// });
module.exports = app;