var express = require('express');
var userConfigRouter = express.Router();
var fs=require('fs')


/** 
 * 将信息保存到本地
*/
var fsOperateFuncs={
    getTempPath(name){
        return './userUpload/'+name
    },
    getFilePath(name){
        return './userUpload/'+name+'/'+name+'.json'
    },
    localStoreFS(name,data){
        if(! fs.existsSync(this.getTempPath(name))){
            fs.mkdirSync(this.getTempPath(name))
            fs.appendFileSync(this.getFilePath(name),'{}')
            console.log('目录及空json文件创建完成')
        }
        return new Promise((resolve,reject)=>{
            this.modifyFile(name,data).then(data=>{
                resolve(data)
            }).catch(err=>{
                reject(err)
            })
        })
        
    },
    modifyFile(name,data){
        return new Promise((resolve,reject)=>{
            this.readFile(name).then(oldData=>{
                let Obj=JSON.parse(oldData)
                console.log('修改前的数据是',Obj,'新增的数据是：',data)
                Object.assign(Obj,data)
                console.log('合并后的文件数据是：',Obj)
                this.writeFile(name,Obj).then(data=>{
                    resolve(data)
                }).catch(err=>{
                    reject(err)
                })     
            })
        })
    },
    readFile(name){
        return new Promise((resolve,reject)=>{
            fs.readFile(this.getFilePath(name),(err,data)=>{
                if (err) reject(err)
                resolve(data.toString())
            })
        })
    },
    writeFile(name,data){
        return new Promise((resolve,reject)=>{
            fs.writeFile(this.getFilePath(name),JSON.stringify(data),(err)=>{
                if(err) reject(err)
                resolve('修改成功')
            })
        })
    },
    /**删除文件 */
    removeFile(name){
        fs.unlink(this.getFilePath(name), (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
    }
}


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

// let inserObj={
//     'id':1,
//     'name':'zhang'
// }
// fsOperateFuncs.localStoreFS('li',inserObj).then(date=>{
//     console.log('返回到页面的数据是',data)
// }).catch((err)=>{
//     console.error(err)
// })
module.exports = userConfigRouter