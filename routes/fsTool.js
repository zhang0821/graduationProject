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
    }
}

module.exports=fsOperateFuncs