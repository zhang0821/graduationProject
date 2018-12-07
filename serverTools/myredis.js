const redis = require('redis')

// bluebird.promisifyAll(redis)

const redisClient=redis.createClient({ "host": "127.0.0.1", "port": "6379" });

//对于在线登录的用户，每个以实际编号作为
redisClient.on('error', function (err) { console.log('errorevent - ' + redisClient.host + ':' + redisClient.port + ' - ' + err); });

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
async function list(tablename='ONLINE',name) { 
    const key = tablename;
    name = 'phyyyy';
    try {
        const result = await redisClient.rpush(key, name);
        console.log('list测试的输出',result);//正常插入后，返回false？
    } catch (error) {
        console.error('list测试的输出err,hhh ',error);
    }
 }
 list()

let redisObj={
    usrSearch(usr){
        return new Promise((resolve,reject)=>{
            let resultObj
            redisClient.hget('USER',usr,function(err,res){
                if(res){
                    resultObj=JSON.parse(res)
                    console.log('usrSearch返回的数据参数',resultObj)
                    resolve(resultObj.area)
                }else{
                    reject(err)
                }
            })
        })
    },
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
    }
}
// redisObj.usrSearch=function(usr){
//     return new Promise((resolve,reject)=>{
//         let resultObj
//         redisClient.hget('USER',usr,function(err,res){
//             if(res){
//                 resultObj=JSON.parse(res)
//                 console.log('usrSearch返回的数据参数',resultObj)
//                 resolve(resultObj)
//             }else{
//                 reject(err)
//             }
//         })
//     })
// }


module.exports = redisObj