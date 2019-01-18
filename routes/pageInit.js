var express = require('express');
var infoInitRouter = express.Router();
var fsOperateFuncs=require('./fsTool')

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

module.exports = infoInitRouter