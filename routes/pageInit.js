var express = require('express');
var infoInitRouter = express.Router();
var fsOperateFuncs=require('./fsTool')
var fs=require('fs')
var path=require('path')

var initInfo={
    getNodes(name){
        return new Promise((resolve,reject)=>{
            fsOperateFuncs.readFile(name).then((data)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            })
        })
        
    }
}
infoInitRouter.post('/nodes',(req,res,next)=>{
    let user=req.param('username')
    initInfo.getNodes(user).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.end(err)
    })
})

infoInitRouter.all('/tabImg',(req,res,next)=>{
    console.log('前端图片请求带参',req.body.imgparam)
    let usr=req.body.imgparam.usr,
        tabIndex=req.body.imgparam.tabIndex
        let filePath=path.join(__dirname + "/../userUpload/"+usr+"/bgImgOftab"+tabIndex+'.jpg')
        let file=fs.readFileSync(filePath)
        res.send(file)   
})

module.exports = infoInitRouter