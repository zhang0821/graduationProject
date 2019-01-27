const fs=require('fs'),
    path=require('path'),
    srcPath=path.join(__dirname,'/../userUpload/'),
    dstPth=path.join(__dirname,'/../dist/static/userUpload'),
    fsOperate=require('../routes/fsTool')

if(!fs.existsSync(dstPth)){
    fs.mkdirSync(dstPth)
}

if(!fs.existsSync(srcPath)){
    fs.mkdirSync(srcPath)
}

function fileInit(){
    console.log('调用fileInit文件')
    //调用文件遍历方法
    fsOperate.fileDisplay(srcPath,dstPth)
}
fileInit()