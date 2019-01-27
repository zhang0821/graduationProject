var path=require('path')
var fs=require('fs')

var fsOperateFuncs={
    getTempPath(name){
        return './userUpload/'+name
        // return path.join(__dirname,'/userUpload/'+name)
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
        if(! fs.existsSync(this.getFilePath(name))){
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
            console.log('当前要读取文件的路径是',this.getFilePath(name))
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
    },

    /**新建文件夹 */
    createDirToSaveUpload(usr){
        // fs.copyFileSync(src, 'destination.txt');
        let dstBase=path.join(__dirname +'/../dist/static/userUpload/')
        if(!fs.existsSync(dstBase)){
            fs.mkdirSync(dstBase)
        }
        dstBase=dstBase+usr+'/'
        if(!fs.existsSync(dstBase)){
            fs.mkdirSync(dstBase)
        }
        return dstBase
    },

    /**复制文件夹 */
    copyDirFiles(sourceDir,distDir){

    },

    //文件遍历方法
    fileDisplay,


}

function fileDisplay(filePath,dstDir){
    copyFolder(filePath,dstDir)
    //根据文件路径读取文件，返回文件列表
//     fs.readdir(filePath,function(err,files){
//         if(err){
//             console.warn(err)
//         }else{
//             //遍历读取到的文件列表
//             files.forEach(function(filename){
//                 //获取当前文件的绝对路径
//                 var filedir = path.join(filePath, filename);
//                 //根据文件路径获取文件信息，返回一个fs.Stats对象
//                 fs.stat(filedir,function(eror, stats){
//                     if(eror){
//                         console.warn('获取文件stats失败');
//                     }else{
//                         var isFile = stats.isFile();//是文件
//                         var isDir = stats.isDirectory();//是文件夹
//                         if(isFile){
//                             console.log(filedir);
//                             //拷贝文件到同路径
// 　　　　　　　　　　　　　　　　　// 读取文件内容
//                             // var content = fs.readFileSync(filedir, 'utf-8');
//                             // console.log(content);
//                         }
//                         if(isDir){
//                             fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
//                             //目的地文件中创建文件夹
//                             console.log('当前文件夹名字',filedir,'拷贝到目的文件夹是',dstDir)
//                             dstDir+=getLastPathName(filedir)
//                             fs.mkdirSync(dstDir)
//                         }
//                     }
//                 })
//             });
//         }
//     });
}

function getLastPathName(path){
    let dirARR=path.split('\\')
    // console.log('拆分的文件夹数组是',dirARR)
    return '\\'+dirARR[dirARR.length-1]
}


/*********************************** */

//! 将srcDir文件下的文件、文件夹递归的复制到tarDir下
function copyFolder(srcDir, tarDir, cb) {
    fs.readdir(srcDir, function(err, files) {
      var count = 0;
      var checkEnd = function() {
        ++count == files.length && cb && cb();
      }
   
      if (err) {
        checkEnd();
        return;
      }
   
      files.forEach(function(file) {
        var srcPath = path.join(srcDir, file);
        var tarPath = path.join(tarDir, file);
   
        fs.stat(srcPath, function(err, stats) {
          if (stats.isDirectory()) {
            console.log('mkdir', tarPath);
            fs.mkdir(tarPath, function(err) {
              if (err) {
                console.log(err);
                return;
              }
   
              copyFolder(srcPath, tarPath, checkEnd);
            });
          } else {
            copyFile(srcPath, tarPath, checkEnd);
          }
        });
      });
   
      //为空时直接回调
      files.length === 0 && cb && cb();
    });
  }
  //! 将srcPath路径的文件复制到tarPath
  function copyFile(srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath);
    rs.on('error', function(err) {
      if (err) {
        console.log('read error', srcPath);
      }
      cb && cb(err);
    })
   
    var ws = fs.createWriteStream(tarPath);
    ws.on('error', function(err) {
      if (err) {
        console.log('write error', tarPath);
      }
      cb && cb(err);
    })
    ws.on('close', function(ex) {
      cb && cb(ex);
    })
   
    rs.pipe(ws);
  }
module.exports=fsOperateFuncs