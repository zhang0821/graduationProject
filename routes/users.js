var express = require('express');
var router = express.Router();
let path=require('path')

var fs=require('fs')
var redis=require('../serverTools/myredis')

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
  var userName = req.body.loginParam.login_username;
  var pwd = req.body.loginParam.login_password;

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