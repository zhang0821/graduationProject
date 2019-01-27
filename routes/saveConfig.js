var express = require('express');
var userConfigRouter = express.Router();
var fs=require('fs')
var fsOperateFuncs=require('./fsTool')
var path=require('path')
var formidable=require('formidable')

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

/**
 * 处理图片上传 
 */
userConfigRouter.post('/fileLoad/img',(req,res,next)=>{
    console.log('接收到前端文件上传,index:',req.query.index,'usr:',req.query.usr)
   
    let form =new formidable.IncomingForm()
    form.encoding='utf-8'
    form.uploadDir=path.join(__dirname + "/../userUpload/")
    form.keepExtensions =true //使得上传的文件保持原来的文件的扩展名。
    
    form.parse(req, function (err, fields, files){//所有的文本域、单选框，都在fields存放；//所有的文件域，files
        let nameArr=files.file.name.split('.')
        let type=nameArr[nameArr.length-1]

        let tempPath = form.uploadDir +req.query.usr+"\\"
        let fileName="bgImgOftab"+req.query.index+".png"//此处统一改成png+type 
        let fileFinalPath=tempPath+fileName
        
        /**先判断该类文件是否存在 */
        if(fs.existsSync(fileFinalPath)){
            // 删除之前的旧文件
            fs.unlinkSync(fileFinalPath)
            console.log('删除了之前的同名文件')
        }
        //判断文件夹是否存在，
        //不同路径下的文件更名 + 移动：（新的路径必须已存在，路径不存在会返回异常）
        if(fs.existsSync(tempPath)){
            console.log('该路径已存在')
        }else{
            fs.mkdirSync(tempPath)
        }

        fs.rename(files.file.path,fileFinalPath,(err)=>{
            if(err){
                console.log('重命名操作失败',err)
            }else{
                let distSaveDir=fsOperateFuncs.createDirToSaveUpload(req.query.usr)
                fs.writeFileSync(distSaveDir+fileName,fs.readFileSync(fileFinalPath))//并转存到dist
                res.writeHead(200, {'content-type': 'text/plain'});
                res.end("成功");
                console.log('操作成功')
            }
        });
    })

})
/**
 * 处理音乐文件上传 
 */
userConfigRouter.post('/fileLoad/media',(req,res,next)=>{
    console.log('接收到前端文件上传,usr:',req.query.usr)
    let form =new formidable.IncomingForm()
    form.encoding='utf-8'   
    form.uploadDir=path.join(__dirname + "/../userUpload/")
    form.keepExtensions =true //使得上传的文件保持原来的文件的扩展名。
    
    form.parse(req, function (err, fields, files){//所有的文本域、单选框，都在fields存放；//所有的文件域，files
        let nameArr=files.file.name.split('.')
        let type=nameArr[nameArr.length-1]

        var tempPath = form.uploadDir +req.query.usr+"\\"

        let fileFinalPath=tempPath+"fireMusic."+type
        if(fs.existsSync(fileFinalPath)){
            fs.unlinkSync(fileFinalPath)
            console.log('删除了之前的同名音乐文件')
        }
        if(fs.existsSync(tempPath)){
            console.log('该路径已存在')
        }else{
            fs.mkdirSync(tempPath)
        }
        fs.rename(files.file.path,fileFinalPath,(err)=>{
            if(err){
                console.log('重命名操作失败',err)
            }else{
                let distSaveDir=fsOperateFuncs.createDirToSaveUpload(req.query.usr)
                fs.writeFileSync(distSaveDir+"fireMusic.mp3",fs.readFileSync(fileFinalPath))//并转存到dist
                console.log('操作成功')
            }
        });
    })

})

module.exports = userConfigRouter