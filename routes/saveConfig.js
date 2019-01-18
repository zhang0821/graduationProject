var express = require('express');
var userConfigRouter = express.Router();

var fsOperateFuncs=require('./fsTool')

/** 
 * 处理前端配置信心保存
 * /save/:usernam ————处理 /:xxx 形式的 get 请求
*/
userConfigRouter.post('/save',(req,res,next)=>{
    let user=req.param('username')
    let strObj=req.param('data')
    console.log('服务器接收页面设计提交的信息是：',user,'数据是',strObj)
    fsOperateFuncs.localStoreFS(user,strObj).then(data=>{
        res.send(data)
    }).catch((err)=>{
        console.error(err)
    })
});

module.exports = userConfigRouter