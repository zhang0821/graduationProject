#!/usr/bin/env node
var app = require('../app');
var debug = require('debug')('node-first:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
var io = require('socket.io')(server, {
  pingInterval: 60000,
  pingTimeout: 5000,
  cookie: false
});
server.listen(port);


io.use((socket, next) => {
  let token = socket.handshake.query.token;
  if (token) {
    return next();
  }
  return next()
});
var WSClients={} //全局量，存放当前客户端——放在高速缓存中
const infosNamespace=io.of('/infos').on('connect',(socket)=>{
                            // var nameSpace=socket.nsp;
  var clientName='client'+Object.keys(WSClients).length //为每个连接的ws客户端取名
                            // WSClients.push(socket.id)//记录每一个客户端，给指定client 发送信息
  socket.join('zhang',()=>{
    let cliets=Object.keys(socket.rooms)
    WSClients[cliets[0]]=cliets[1];
    console.log('显示当前WSClients结构',WSClients)
                                            // nameSpace.emit('recv',cliets)
    console.log(Object.keys(WSClients))
  })
  //在一个房间内广播
  infosNamespace.to('zhang').emit('recv','加入了共同的房间')
        //指定消息
        if(Object.keys(WSClients).length>0){
          console.log('我要指定发送的客户端id',WSClients)

        }
    infosNamespace.clients((error,clients)=>{
      if(error) throw error
      console.log('展示当前连接的所有用户',clients)
    })
})

io.of('/main').on('connect',(socket)=>{
  let rooms_cur = Object.keys(socket.rooms);
  console.log('main中已连接的客户端信息',rooms_cur)
  
  /*** 断开连接时  */
  socket.on('disconnecting',(reason)=>{
    let rooms = Object.keys(socket.rooms);
    socket.leave
    console.log('main要断开的客户端是',rooms,'原因是：',reason)
  })

  //关闭连接的话，剔除他在列队中的信息
  socket.on('disconnect',(reason)=>{
    let rooms = Object.keys(socket.rooms);
    console.log('main已经断开的客户端是',rooms,'原因是：',reason)
  })
  // setTimeout(() => socket.disconnect(true), 5000);

  /**
   * 事件通信时
   */
  socket.on('ClientEvt1',function (name, word, fn) {
    fn(name + ' says ' + word);
  })

  socket.on('heartBeat',()=>{

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

module.exports=io
