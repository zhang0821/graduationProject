<template>
  <div class="test">
     <button  @click="start"> ws测试</button>
  </div>
  
  </template>
  <script>
    
  export default {    
      name : 'wstest',
        data() {      
            return {        
                websock_root: null,
                // websock_info:null
            }
        },
    created() {      
    },
    destroyed() {      
        this.websock_root.close() //离开路由之后断开websocket连接
    },    
    methods: {
    start(){
        this.initRootWebSocket()
    },
    initRootWebSocket(){ //初始化weosocket//usr,pwd
        const wsuri= "/infos"
        this.websock_root = io(wsuri,{autoConnect: false});
        // Vue.use(VueSocketio, socketio('/wsuri'));
        this.websock_root.open()
        this.websock_root.on('connect',()=>{
            console.log('socket连接成功',this.websock_root.id)
            socket.emit('ClientEvt1','ClientEvt2','ClientEvt3',(data)=>{
                console.log('ClientEvt1测试',data)
            })
            socket.on('reply',(data)=>{
                console.log('监听到的replay返回',data)
            })
        })
        
      },

      websocktConnect(){ //连接建立之后执行send方法发送数据
            
      },
      websocket(){//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
        const redata = JSON.parse(e.data);
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
    },
  }
  </script>

<style>
.test{
    width: 100px;
    height: 50px;
    background: #699;
}
</style>
