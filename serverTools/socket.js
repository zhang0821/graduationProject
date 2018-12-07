
console.log('socket.js被调用')
const Promise=require('bluebird')
const app = require('../app');
const port = normalizePort(process.env.PORT || '8080');
      app.set('port', port);
const server=app.listen(port);

const io = require('socket.io').listen(server);
const redis=require('./myredis')


let WSClients={} //全局量，存放当前客户端——放在高速缓存中

//获取连接所属房间名
const getroomname=(rObj={},sid)=>{
  console.log('getroomname函数被调用，传入的sid是',sid)
  let startpos=sid.indexOf('#')
  if(startpos>-1){
    sid=sid.substring(startpos+1)
    console.log('截取后的字符串是',sid)
  }
  for(var item in rObj){
    if(item == sid){
      console.log('找到了sid的键对应的值',rObj[item])
      return rObj[item]
    }
  }
}
//移除对象属性
const omit = (obj, uselessKeys) =>
  uselessKeys.reduce((acc, key) => {
    return {...acc, [key]: undefined}
  }, obj)


let socketEvent={
  //登录判断
  authenLogin(usr){
    return new Promise((resolve,reject)=>{
      redis.usrSearch(usr).then((data)=>{
        console.log('socket操作redis后返回的数据',data)
        if(data){
          console.log('用户所属的房间',data)
          resolve(data)
        }else{
          resolve('notFound')
        }
      }).catch((err)=>{
        console.log(err)
        reject(err)
      })
    })
  },
  //更新节点信息到客户端
  unpdateMsgToClient(info,roomname,nameSpace=infosNamespace){
    if(nameSpace != undefined){
      console.log('进入广播触发devMsg到客户端',roomname)
      nameSpace.to(roomname).emit('devMsg',JSON.stringify(info))
    }
    
  },
  //连接的ws客户端加入到广播房间
  clientJoinRoom(socket,roomname){
    socket.join(roomname,()=>{
      let cliets=Object.keys(socket.rooms)
      console.log(socket.id+'加入房间'+roomname)
      console.log('该房间当前全部用户'+cliets)      
      // WSClients[cliets[0]]=cliets[1];
    })

  },
  clientLeaveRoom(socket,roomname){
    socket.leave(roomname,()=>{
      console.log(socket.id+'离开房间'+roomname)
      let cliets=Object.keys(socket.rooms)
      console.log('该房间当前全部用户'+cliets)   
      //并删除WSclient中的该id
      let sid=socket.id,
        startpos=sid.indexOf('#')
      if(startpos>-1){
        sid=sid.substring(startpos+1)
      }
      omit(WSClients,[sid])

    })
  },
  //当前连接的用户
  showOnlineClient(Namespace=infosNamespace){ //传参namespace和socket的不同
    Namespace.clients((error,clients)=>{
      if(error) throw error
      console.log('当前连接的所有用户',clients)
      return clients
    })
  }
}

// 客户端登录时的用户检测连接
io.use((socket, next) => {
  let usr = socket.handshake.query.username;
  console.log('此次连接的用户名是：',usr)
  socketEvent.authenLogin(usr).then((data)=>{
    console.log('use中返回find参数',data)
    if(data != 'notFound'){
      WSClients[socket.id]=data
      return next()
    }else{
      next(new Error('认证失败'))
    }
  }).catch((err)=>{
    console.log(err)
    next(new Error('认证失败'))
  })
});
io.on('connection', (socket) => {
  console.log(socket.conn.remoteAddress, 'connected')
  socket.emit('hello','这是后台发给前端接收的消息')
  socket.on('disconnect', (reason) => {
    console.log(socket.conn.remoteAddress, 'disconnect, reason:', reason)
  })
})

const infosNamespace=io.of('/infos').on('connect',(socket)=>{
  socket.emit('devMsg','hello i am msg')
  let roomname=getroomname(WSClients,socket.id)
  console.log('conn函数中传入的判断得出区域名字'+roomname,WSClients)
                    // var nameSpace=socket.nsp;
  socketEvent.clientJoinRoom(socket,roomname)  
  /*** 在一个房间内广播消息  */
  // socketEvent.unpdateMsgToClient('06000000010','1',roomname,infosNamespace)

  /** 展示当前连接的所有用户 */
  socketEvent.showOnlineClient(infosNamespace)
  /*** 断开连接时  */
  socket.on('disconnecting',(reason)=>{
    console.log('断开的原因是：',reason)
    socketEvent.clientLeaveRoom(socket,roomname)
    socketEvent.showOnlineClient(infosNamespace)
  })
  socket.on('myPing',(data)=>{
    console.log('心跳检测接收',data)
  })
})



// io.of('/main').on('connect',(socket)=>{
//   let rooms_cur = Object.keys(socket.rooms);
//   console.log('main中已连接的客户端信息',rooms_cur)
  
//   /*** 断开连接时  */
//   socket.on('disconnecting',(reason)=>{
//     let rooms = Object.keys(socket.rooms);
//     socket.leave
//     console.log('main要断开的客户端是',rooms,'原因是：',reason)
//   })

//   //关闭连接的话，剔除他在列队中的信息
//   socket.on('disconnect',(reason)=>{
//     let rooms = Object.keys(socket.rooms);
//     console.log('main已经断开的客户端是',rooms,'原因是：',reason)
//   })
//   // setTimeout(() => socket.disconnect(true), 5000);

//   /**
//    * 事件通信时
//    */
//   socket.on('ClientEvt1',function (name, word, fn) {
//     fn(name + ' says ' + word);
//   })

//   socket.on('heartBeat',()=>{

//   })

// })
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


module.exports={
  server,
  socketEvent
}