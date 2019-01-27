var express = require('express');
var router = express.Router();
var crypto = require('crypto');
// just for tutorial, it's bad really
let path=require('path')

var fs=require('fs')
var info=JSON.parse(fs.readFileSync('./routes/userInfo.json'))

var userdb=info.userName

function getLastLoginTime(userName){
  for(var i = 0; i < userdb.length; ++i){
    var user = userdb[i];
    if(userName === user.userName){
      return user.last;
    }
  }
  return "";
}

function updateLastLoginTime(userName){
  for(var i = 0; i < userdb.length; ++i){
    var user = userdb[i];
    if(userName === user.userName){
      user.last = Date().toString();
      return;
    }
  }
}

function authenticate(userName, hash){
  for(var i = 0; i < userdb.length; ++i){
    var user = userdb[i];
    if(userName === user.userName){
      if(hash === user.hash){
          return 0;
      }else{
          return 1;
      }
    }
  }

  return 2;
}

function isLogined(req){
  if(req.cookies["account"] != null){
    var account = req.cookies["account"];
    var user = account.account;
    var hash = account.hash;
    if(authenticate(user, hash)==0){
      console.log(req.cookies.account.account + " had logined.");
      return true;
    }
  }
  return false;
};

router.requireAuthentication = function(req, res, next){
  if(req.path == "/login"){
    next();
    return;
  }

  if(req.cookies["account"] != null){
    var account = req.cookies["account"];
    var user = account.account;
    var hash = account.hash;
    if(authenticate(user, hash)==0){
      console.log(req.cookies.account.account + " had logined.");
      next();
      return;
    }
  }
  console.log("not login, redirect to /login");
  res.redirect('/login?'+Date.now());
};


router.post('/login', function(req, res, next){
  var userName = req.body.loginParam.login_username;
  var pwd = req.body.loginParam.login_password;
  console.log("login_username - " + userName + " password - " + pwd );
  let returnData={
    state:null,
    data:null
  }
  switch(authenticate(userName, pwd)){
    case 0: //success
      var lastTime = getLastLoginTime(userName);
      updateLastLoginTime(userName);
      console.log("login ok, last- " + lastTime);
      res.cookie("account", {account: userName, hash: pwd, last: lastTime}, {maxAge: 60000});
      let filePath=path.join(__dirname + "/../userUpload/"+userName+'/'+userName+'.json')
          
      if(fs.existsSync(filePath)){
        let nodeInfo=JSON.parse(fs.readFileSync(filePath))
        returnData.state="2"
        returnData.data=nodeInfo
        
      }else{//未注册节点
        returnData.state="3"
      }
      break;
    case 1: //password error
      console.log("password error");
      returnData.state="0"
      break;
    case 2: //user not found
      console.log("user not found");
      returnData.state="1"
      break;
  }
  console.log('登陆后返回数据信息',returnData)
  res.json(returnData)
});
router.get('/logout', function(req, res, next){
  res.clearCookie("account");
});

router.post('/regist', (req, res, next)=>{
  let usr=req.param('data')
  console.log('新注册的用户信息是',usr)
  userdb.push(usr)
  let newObj={
    "userName":userdb
  }
  fs.writeFile('./routes/userInfo.json',JSON.stringify(newObj),(err)=>{
    if(err){
      console.log('操作新增用户json文件失败')
      res.end()
    }
    res.send('新增用户成功')
  })


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