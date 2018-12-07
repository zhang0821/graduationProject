var express = require('express');
var router = express.Router();
var crypto = require('crypto');

function hashPW(userName, pwd){
  var hash = crypto.createHash('md5');
  hash.update(userName + pwd);
  return hash.digest('hex');
}

// just for tutorial, it's bad really
var userdb = [
    {
      userName: "admin",
      hash:  "123456",
      last: ""
    },
    {
      userName: "foruok",
      hash: "888888",
      last: ""
    }
  ];

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
  // var hash = hashPW(userName, req.body.login_password);
  var pwd = req.body.loginParam.login_password;
  console.log("login_username - " + userName + " password - " + pwd );
  switch(authenticate(userName, pwd)){
  case 0: //success
    var lastTime = getLastLoginTime(userName);
    updateLastLoginTime(userName);
    console.log("login ok, last- " + lastTime);
    res.cookie("account", {account: userName, hash: pwd, last: lastTime}, {maxAge: 60000});
    res.send("2");
    break;
  case 1: //password error
    console.log("password error");
    res.send("0");
    break;
  case 2: //user not found
    console.log("user not found");
    res.send("1");
    break;
  }
});
router.get('/logout', function(req, res, next){
  res.clearCookie("account");
});

module.exports = router;