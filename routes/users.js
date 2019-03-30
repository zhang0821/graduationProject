var express = require('express');
var router = express.Router();
let path=require('path')

var fs=require('fs')
var redis=require('../serverTools/myredis')

var rsa=require('../serverTools/rsa')

var serverRSA= new rsa.RSAserver()
const serverPublicKey = serverRSA.getPublicKey()  //发送给客户端，让其对数据进行加密
const serverPrivateKey = serverRSA.getPrivateKey() //解密客户端加密数据

router.post("/sysInit",(req,res,next)=>{
    // let myRSA =new rsa.RSAclient()
    // let private=myRSA.getPrivateKey()
    res.send(serverPublicKey) //将服务器端统一的公钥发送给客户端
});

/**保存每个客户端的公私钥信息 */
let userKey={
  
}


//用户名校验
function authenticate(userName, pwd){
  return new Promise((resolve,reject)=>{
    redis.usrSearch(userName).then(info=>{
      if(pwd == info.pwd){
        console.log('登录密码正确')
        resolve(0) //密码正确 
      }else{
        console.log('登录密码错误')
        resolve(1) //密码错误
      }
    }).catch(err=>{
      console.log('未找到用户')
      reject(2)
    })
  })
}
router.requireAuthentication = function(req, res, next){
  if(req.path == "/login"){
    next();
    return;
  }

  // if(req.cookies["account"] != null){
  //   var account = req.cookies["account"];
  //   var user = account.account;
  //   var hash = account.hash;
  //   if(authenticate(user, hash)==0){
  //     console.log(req.cookies.account.account + " had logined.");
  //     next();
  //     return;
  //   }
  // }
  // console.log("not login, redirect to /login");
  // res.redirect('/login?'+Date.now());
};


router.post('/login', function(req, res, next){
  console.log('userKey存储信息是',userKey)

  var userName = serverRSA.decryptData(req.body.loginParam.login_username)
  var pwd = serverRSA.decryptData(req.body.loginParam.login_password)
  
  // var userName = req.body.loginParam.login_username;
  // var pwd = req.body.loginParam.login_password;

  console.log("login_username - " + userName + " password - " + pwd );
  authenticate(userName, pwd).then(info=>{
    let returnData={
      state:null,
      data:null
    }
    if(info == 0){
      let filePath=path.join(__dirname + "/../userUpload/"+userName+'/'+userName+'.json')
          
      if(fs.existsSync(filePath)){
        let nodeInfo=JSON.parse(fs.readFileSync(filePath))
        returnData.state="2"
        returnData.data=nodeInfo
        
      }else{//未注册监测区域信息
        returnData.state="3"
      }
    }else if(info == 1){
      returnData.state="0"
    }

    //查询该用户名下是否生成过公私钥对，获取公钥，对returnData数据进行加密，再发送，同时，把它的私钥传给他
    console.log('当前用户下是否有公私钥',userKey[userName])
    let final = null
    if(!userKey[userName]){
      let rsaKEY=new rsa.RSAclient()
      userKey[userName]=rsaKEY
      console.log('当前用户公私钥 信息是',userKey)
      final={
        key:rsaKEY.getPrivateKey(),
        encryptData:rsaKEY.encryptData(JSON.stringify(returnData))
      }
      console.log('加密序列化后的数据是：',rsaKEY.encryptData(JSON.stringify(returnData)))
    }else{
      let rsaKEY=userKey[userName]
      
      final={
        key:rsaKEY.getPrivateKey(),
        encryptData:rsaKEY.encryptData(JSON.stringify({"0":111}))
      }
    }
    
    res.json(returnData)
  }).catch(data=>{
    console.log('登录函数进入catch,返回数据',data)
    res.json({
      state:"1",
      data:null
    })
  })
});


/**注册新用户 */
router.post('/regist', (req, res, next)=>{
  let usrInfo=req.param('data')
  console.log('新注册的用户信息是',usrInfo)
  redis.saveUsr(usrInfo.userName,JSON.stringify(usrInfo)).then(data=>{
    if(data){
      res.send('新增用户成功')
    }else{
      res.send('该用户已存在')
    }
  })
          // userdb.push(usrInfo)
          // let newObj={
          //   "userName":userdb
          // }
          // fs.writeFile('./routes/userInfo.json',JSON.stringify(newObj),(err)=>{
          //   if(err){
          //     console.log('操作新增用户json文件失败')
          //     res.end()
          //   }
          // })
});

router.all('/userUpload',(req,res,next)=>{
  console.log('请求图片文件',req.url)
  next()
})
router.all('/userUpload/li',(req,res,next)=>{
  console.log('li请求图片文件',req.url)
  next()
})

module.exports = router;