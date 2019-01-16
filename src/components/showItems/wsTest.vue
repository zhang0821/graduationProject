<template>
  <div>
    <p>传入的登录用户名{{username}}</p>
    <!-- <p v-if="isConnected">We're connected to the server!</p>
    <h1>Message from server: "{{socketMessage}}"</h1>
    <button @click="cnnServer()">Ping Server</button>

    
    <h2>设置的重连门限是{{discnnThreshold}}，目前重连次数{{discnnCount}}，ping的定时器timer{{pingTimer}}</h2> -->
  </div>
</template>

<script>

import Vue from 'vue'
import store from '@/store/'
import * as socketio from 'socket.io-client'
import * as VueSocketIO from 'vue-socket.io'
import { setTimeout, setInterval, clearInterval } from 'timers';

export default {
  data() {
    return {
      // wsuri:'ws://localhost:8080/infos',
      wsuri:'ws://10.149.65.187:8080',
      isConnected: false,
      SocketInstance:'',
      socketMessage: '还未收到数据',
      pingTimer:null,
      discnnCount:0,
      intervalTime:5000,
      discnnThreshold:5,
      sid:null
    }
  },
  props:['username'],

  created() { 
    let usr=this.username 
    console.log('子组件接收到的传入的用户名参数',usr)
    this.SocketInstance= socketio(this.wsuri,{
    autoConnect: false,
    // reconnection:false,
    reconnectionDelay:3000,
    reconnectionAttempts:8,
    query:{
      username:usr
    }
    })

    this.cnnServer()
    
    Vue.use(VueSocketIO, this.SocketInstance,store)


  },
  methods: {
    cnnServer() {
       this.SocketInstance.open()
      // // Send the "pingServer" event to the server.
      // this.$socket.emit('pingServer', 'PING!')
    },
    //服务器状态不佳时，ping的周期也降低
    ping(interval=5){
      if(this.discnnCount>1){
        interval*=(Math.floor(this.discnnCount/2)+1)
      }
      
       console.log('ping函数被调用，这次的时间间隔是'+interval)
       if(this.pingTimer == null ){
         this.pingTimer=setInterval(()=>{
            this.SocketInstance.emit('myPing',this.SocketInstance.id)
            console.log('当前发送ping的时间',(new Date()).toString())
        },interval*1000)
       }
       
      this.SocketInstance.on('myPong',(data)=>{
          console.log('收到服务端的pong回复',data)
          this.SocketInstance.emit('reply',this.SocketInstance.id)
          
        })

    },
    delayReconn(latency){
        latency*=this.discnnCount
        console.log('此时的disconnect'+this.discnnCount+'本次延迟重连的时间：'+this.intervalTime*this.discnnCount)
        setTimeout(()=>{
          this.cnnServer()
          console.log("调用delayReconn重新连接服务器")
        },this.intervalTime*this.discnnCount)
    },

    myReconn(latency){
      setTimeout(()=>{
        this.SocketInstance.open()
        console.log('重连的延时'+latency)
      },latency*1000)
    },
    myClose(s){
      console.log('进入客户端的主动断开连接函数')
      setTimeout(()=>{
        this.SocketInstance.close()
          setTimeout(()=>{
            this.cnnServer()
          },this.intervalTime*this.discnnCount)
      },s*1000)
      if(this.pingTimer){
        clearInterval(this.pingTimer)
        this.pingTimer = null 
      }
    }
  },
  mounted() {
    this.SocketInstance.on('connect',()=>{
        if(this.discnnCount > 0) {
          this.discnnCount=Math.floor(this.discnnCount/2)
        }
        this.socketMessage='客户端socket连接成功,id是'+this.SocketInstance.id
        //this.ping() //开启心跳检测
    })
    this.SocketInstance.on('devMsg',(data)=>{
              // this.$store.commit('updateMqttDiff',(new Date).getTime())
        // let dataObj=JSON.parse(data)
        // console.log('返回的infoOBJ是',dataObj)
        // if(typeof dataObj == 'object'){
        //   console.log('要开始更新全局节点数据')
        //   if(dataObj[dataObj.length-1].status){
        //     this.$store.commit('updateInfo',dataObj[dataObj.length-1])
        //   }
        // }
        let dataObj=JSON.parse(data)
        console.log('devMsg中监听到数据',dataObj)
        if(typeof dataObj == 'object'){
          console.log('数据更新到视图')
            this.$store.commit('dataTrans/updateInfo',dataObj)
        }
    })
    
    // 重连成功才会触发
    this.SocketInstance.on('reconnect',()=>{
        console.log('reconnect触发客户端重连成功')
        if(this.discnnCount > 0) {
          this.discnnCount=Math.floor(this.discnnCount/2)
        }
        //this.ping()      
    })

    //关闭连接后，新建连接，连接失败
    // this.SocketInstance.on('connect_error',()=>{
    //     console.log('connect_error触发，进入客户端连接失败函数')
    //     this.discnnCount++
    //     this.delayReconn(5)

    //     if(this.discnnCount > this.discnnThreshold){
    //        console.log('客户端重连失败后次数超过门限') 
    //       this.SocketInstance.close() //关闭后，很长时间后再重新建立连接
    //       // this.discnnCount=0
    //       this.$store.conut=0
    //       this.myReconn(30)
    //     }   
    // })
    // 尝试重连时触发
    this.SocketInstance.on('reconnect_attempt',()=>{
        console.log('reconnect_attemptc触发客户端尝试重连，已经重连次数',this.discnnCount,'当前时间',(new Date()).toString()) 
        this.discnnCount++
        if(this.discnnCount > this.discnnThreshold){
          console.log('客户端重连次数超过门限') 
          clearInterval(this.pingTimer)  
          this.pingTimer = null
          this.myClose(1) //多次尝试连接后，失败后，客户端主动关闭
        }
        // else{
        //   this.delayReconn(5)
        // }      
    })
    //无法重连时触发
    /**从未被触发 */
    this.SocketInstance.on('reconnect_failed',()=>{
        this.discnnCount++
        console.log('reconnect_failed触发，客户端重连失败') 
        // this.delayReconn(5)
        if(this.discnnCount > this.discnnThreshold){
           console.log('客户端重连失败后次数超过门限') 
          this.SocketInstance.close() //关闭后，很长时间后再重新建立连接
          // this.discnnCount=0
          this.$store.dataTrans.conut=0
          this.myReconn(30)
        }     
    })
                             

    this.SocketInstance.on('disconnect',(reason)=>{
        console.log('disconnect触发，服务端主动断开连接后触发,原因是',reason)//会自动尝试重连
        // 并将所有参数恢复到初始值
        // this.discnnCount=0
        clearInterval(this.pingTimer)  
        this.pingTimer = null    
    })
    // this.SocketInstance.on('ping',()=>{
    //   console.log('协议API自带客户端ping,当前时间',(new Date()).toString())
    // })
    
    // this.SocketInstance.on('pong',(latency)=>{
    //   console.log('协议API自带，pong延时',latency)
    // })
  },
  destroyed() {
    this.SocketInstance.close()
    clearInterval(this.pingTimer)  
    this.pingTimer=null
  },
}
</script>