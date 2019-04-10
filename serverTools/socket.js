

const Promise=require('bluebird')
const app = require('../app');
const port = normalizePort(process.env.PORT || '8080');
      app.set('port', port);
const server=app.listen(port);


const io = require('socket.io').listen(server,{
  pingInterval: 10000,
  pingTimeout: 5000,
});


const redis=require('./myredis')


let WSClients={} //全局量，存放当前客户端——放在高速缓存中

//获取连接所属房间名
const getroomname=(rObj={},sid)=>{
  console.log('getroomname函数被调用，传入的sid是',sid)

  // let startpos=sid.indexOf('#')
  // if(startpos>-1){
  //   sid=sid.substring(startpos+1)
  //   console.log('截取后的字符串是',sid)
  // }

  for(var item in rObj){
    if(item == sid){
      console.log('找到了sid的键对应的值',rObj[item])
      return rObj[item]
    }
  }
}
//移除对象属性
const omit = (obj, uselessKeys) =>{
  console.log('要移除的属性是',uselessKeys)
  uselessKeys.forEach(e => {
      delete obj[e]
  });
}


let socketEvent={
  waitThreshold:10,
  waitTimer:null,
  //登录判断
  authenLogin(usr){
    return new Promise((resolve,reject)=>{
      redis.usrSearch(usr).then((data)=>{
        console.log('socket操作redis后返回的数据',data.area)
        data=data.area
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
  updateMsgToClient(info,roomname,nameSpace=infosNamespace){
    if(nameSpace != undefined){
      let exist=0
      for(var clinet in WSClients){
        roomname=roomname.area
        console.log('clinet',WSClients[clinet],'roomname',roomname)
        if(WSClients[clinet] == roomname){
          exist=1
        }
      } 
      if(exist == 1){
        console.log('服务端开始发送更新的数据到客户端',roomname)
        nameSpace.to(roomname).emit('devMsg',JSON.stringify(info))
      }
    }
    
  },
  //连接的ws客户端加入到广播房间
  clientJoinRoom(socket,roomname){
    socket.join(roomname,()=>{
      let clients=Object.keys(socket.rooms)
      console.log(socket.id+'加入房间'+roomname)
      
      // 将登陆成功的客户端记录在online表中
      redis.addCtoOnline(socket.id,0)
      console.log('该房间当前全部用户'+clients)      
    })


    // 巡检未开启，则开启
    // console.log('有客户端登录，当前的巡检timer是',socketEvent.waitTimer)
    if(socketEvent.waitTimer == null){
      // console.log('进入一次心跳检测函数')
      // socketEvent.waitTimer=setInterval(()=>{
      //   redis.checkHeart().then(offlist=>{
      //     console.log('主函数中的offlist，判定异步信息',offlist)
      //     if(offlist.length > 0){
      //       console.log('巡检判定目前不在线的节点',offlist)
      //       omit(WSClients,offlist)
      //       console.log('移除失联客户端后，剩余在线客户端是',WSClients)
      //     }
      //   }).catch(err=>{
      //     console.log('出错')
      //   })
      //   console.log('当前巡检时间',(new Date()).toString())
      //   // infosNamespace.clients((error,clients)=>{
      //   //   if(error) throw error
      //   //   console.log('socket自动记录的在线用户有',clients)
      //   // })
      // },10000)
    }
  },
   clientLeaveRoom(socket,roomname){
    socket.leave(roomname,()=>{
      console.log(socket.id+'离开房间'+roomname)

      let cliets=Object.keys(socket.rooms)
      console.log('该房间当前全部用户'+cliets)   
      //并删除WSclient中的该id
      let sid=socket.id
      //   startpos=sid.indexOf('#')
      // if(startpos>-1){
      //   sid=sid.substring(startpos+1)
      // }
      omit(WSClients,[sid])

      let ifRoomEmpty=Object.keys(WSClients)
      if(ifRoomEmpty.length == 0){
          clearInterval(socketEvent.waitTimer)
          socketEvent.waitTimer=null
      }
      // 将记录在onlineC表中的客户端删除
      redis.delCfromOnline(sid)
      
    })

    // 在线客户端为空，则关闭巡检
  },
  //当前连接的用户
  showOnlineClient(Namespace=infosNamespace){ //传参namespace和socket的不同
    Namespace.clients((error,clients)=>{
      if(error) throw error
      console.log('当前连接的所有用户',clients)
      console.log('wsclient中记录当前连接的所有用户',WSClients)
      return clients
    })
  },
  returnInit(){
    return new Promise((resolve,reject)=>{
      redis.getInitData().then(data=>{
        if(data){
          resolve(data)
        }else{
          reject(new Error('未找到数据'))
        }
      })
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
// io.of('/infos').on('connection', (socket) => {
//   console.log(socket.conn.remoteAddress, 'connected')
//   socket.emit('hello','这是后台发给前端接收的消息')
//   socket.on('disconnect', (reason) => {
//     console.log(socket.conn.remoteAddress, 'disconnect, reason:', reason)
//   })
// })

var infosNamespace=io.on('connect',(socket)=>{

  let roomname=getroomname(WSClients,socket.id)

  console.log('conn函数中传入的判断得出区域名字'+roomname,WSClients)
                    // var nameSpace=socket.nsp;
                    
  socketEvent.clientJoinRoom(socket,roomname) 
  
  // updateRms(roomname,1) //新增该在线区域

  /*** 在一个房间内广播消息  */
  // socketEvent.updateMsgToClient('06000000010','1',roomname,infosNamespace)

  /** 展示当前连接的所有用户 */
  socketEvent.showOnlineClient(infosNamespace)

              /**用于测试的函数 */
              socket.on('init',(area)=>{
                console.log('要出事信息的区域',area)
                socketEvent.returnInit().then((data)=>{
                    console.log('返回初始信息',data)
                    socket.emit('devMsg',data)
                })
              })
               


  /*** 断开连接时  */
  socket.on('disconnecting',(reason)=>{
    console.log('断开的原因是：',reason)
    socketEvent.clientLeaveRoom(socket,roomname)
  })
  /**完全断开连接 */
  socket.on('disconnect', (reason) => {
    console.log('disconnect, reason:', reason)
    socketEvent.showOnlineClient(infosNamespace)
  })

  /**心跳检测相关 */
  socket.on('myPing',(data)=>{
    console.log('心跳检测接收,客户端id',data,'该客户端是',socket.id)
    socket.emit('myPong','ack from server')
  })
  socket.on('reply',(data)=>{
    console.log('收到客户端的repay,',data,'该客户端是',socket.id)
    redis.addCtoOnline(socket.id,1) // 点名表 该元素置1
  })
})

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