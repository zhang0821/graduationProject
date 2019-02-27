const redis = require('redis')

// bluebird.promisifyAll(redis)

const redisClient=redis.createClient({ "host": "127.0.0.1", "port": "6379" });

//对于在线登录的用户，每个以实际编号作为
redisClient.on('error', function (err) { console.log('errorevent - ' + redisClient.host + ':' + redisClient.port + ' - ' + err); });

// 清空相关数据
redisClient.del('onlineC','ONLINE')



// var str1=JSON.stringify({'type':'tem_hum','area':'phy'})
// redisClient.HMSET('NODE','010000001B',str1)
/**
 * 关于集合set的操作
 */
// redisClient.sadd('test','hello')
// redisClient.sadd('test','hello2')
// redisClient.sismember('test','hello',(err,res)=>{
//     if(res){
//         redisClient.srem('test','hello','hello2')
//     }
// })


let redisObj={
    //在线区域更新
    async updateRms(name,addORdel=1,tablename='ONLINE') {  //addORdel：1 添加房间，-1：删除房间
        const key = tablename;
        try {
            let online_area_list=await redisClient.lrange('ONLINE',0,-1)
            let ifExsist=0
            online_area_list.forEach(v => {
                if(v == name){
                    ifExsist =1
                }
            });
            if(ifExsist == 0 && addORdel == 1){
                const result = await redisClient.rpush(key, name); //rpop
                console.log('listOpera操作后的输出',result);//正常插入后，返回false？
            }
            if(ifExsist == 1 && addORdel == -1){
                const result = await redisClient.rpop(key, name); //rpop
            }
        } catch (error) {
            console.error('list测试的输出err,',error);
        }
     },
     //删除节点
     async  updateNodeInfo(key,info){
           await redisClient.hdel('NODE',key)
           redisClient.hset('NODE',key,JSON.stringify(info))
     },
    //用户查询
    usrSearch(usr){
        return new Promise((resolve,reject)=>{
            let resultObj
            redisClient.hget('USER',usr,function(err,res){
                if(res){
                    resultObj=JSON.parse(res)
                    console.log('usrSearch返回的数据参数',resultObj)
                    resolve(resultObj)
                }else{
                    reject(err)
                }
            })
        })
    },
    //新增用户
    saveUsr(usr,info){
        return new Promise((resolve,reject)=>{
            redisClient.hget('USER',usr,(err,res)=>{
                if(err){
                    reject(err)
                }
                if(res){
                    resolve(false) //该用户已经存在
                }else{
                    redisClient.hset('USER',usr,info)
                    resolve(true)
                }
                
            })
        })
    },
    //节点查询
    nodeSearch(dev_eui){
        return new Promise((resolve,reject)=>{
            let resultObj
            if(!dev_eui){
                dev_eui='0600000000001A'
            }
            redisClient.hget('NODE',dev_eui,function(err,res){
                if(res){
                    resultObj=JSON.parse(res)
                    console.log('usrSearch返回的数据参数',resultObj)
                    resolve(resultObj)
                }else{
                    reject(err)
                }
            })
        })
    },
    //添加新客户端到在线表
    addCtoOnline(sid,status){
        redisClient.hset('onlineC',sid,status);//hmset,同时设置多个键值
    },

    delCfromOnline(sid){
        redisClient.hdel('onlineC',sid,(err,data)=>{
            console.log('删除',data)
        })

    },
    //心跳巡检
    checkHeart(){
        return new Promise((resolve,reject)=>{
            redisClient.hgetall('onlineC',(err,data)=>{
                console.log('心跳巡检hgetall返回结果',data)
                let offList=null
                if(data){
                    offList=[]
                    for(var v in data){
                        console.log('巡检，遍历data',v,'data[v]',data[v])
                        if(data[v] == '0'){
                            offList.push(v)
                        }else{
                          redisClient.hset('onlineC',v,0)
                        }
                       
                    }
                    resolve(offList)
                }else{
                    reject(err)
                }
            })
        })
    },
    getInitData(){
        return new Promise((resolve,reject)=>{
            let objReturn=[]
            redisClient.hgetall('NODE',function(err,data){
                for(var v in data){
                    let vInfo =JSON.parse(data[v])
                    if(vInfo.area == 'test'){
                        vInfo['status']=1
                        console.log('要返回的初始数据是否查找到',JSON.stringify(vInfo))
                        objReturn.push(vInfo)
                    }
                }
                if(objReturn){
                    resolve(JSON.stringify(objReturn))
                }else{
                    reject(err)
                }
            })
        })
         
    },
    //保存新增的节点
    saveNodes(key,info){
        return new Promise((resolve,reject)=>{
            redisClient.hget('NODE',key,(err,res)=>{
                if(err){
                    reject(err)
                }
                if(res){
                    let resInfo = JSON.parse(res)
                    console.log('当前找到的节点信息是',resInfo)
                    if(info.area == resInfo.area){
                        console.log('修改当前节点信息')
                        this.updateNodeInfo(key,info)
                        resolve(true)
                    }else{
                        resolve(false) //该节点已经存在
                    }
                    
                }else{
                    redisClient.hset('NODE',key,JSON.stringify(info))
                    resolve(true)
                }
                
            })
        })
    }
}

module.exports = redisObj