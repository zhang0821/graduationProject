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
    // //调用文件遍历方法
    let dirlist=fs.readdirSync(path.join(__dirname,'../dist/static/userUpload'))
    console.log('当前目录下有的目录有：',dirlist)
    if(dirlist.length<1){
        console.log('未检测到userUpload下有文件，调用fileInit文件')
        fsOperate.fileDisplay(srcPath,dstPth)
    }

}
       
fileInit()