<template>
  <div>
    <p v-if="isConnected">We're connected to the server!</p>
    <p>Message from server: "{{socketMessage}}"</p>
    <button @click="cnnServer()">Ping Server</button>
    <p>传入的登录用户名{{username}}</p>
    <h2>重连次数{{discnnCount}}</h2>
  </div>
</template>

<script>

import Vue from 'vue'
import store from '../store/'
import * as socketio from 'socket.io-client'
import * as VueSocketIO from 'vue-socket.io'
import { setTimeout, setInterval } from 'timers';

export default {
  data() {
    return {
      wsuri:'ws://localhost:8080/infos',
      isConnected: false,
      SocketInstance:'',
      socketMessage: '还未收到数据',
      pingTimer:null,
      discnnCount:0,
      intervalTime:3000,
      discnnThreshold:4
    }
  },
  props:['username'],

  created() { 
    let usr=this.username 
    console.log('子组件接收到的传入的用户名参数',usr)
    this.SocketInstance= socketio(this.wsuri,{
    autoConnect: false,
    query:{
      username:usr
    }
    })
    Vue.use(VueSocketIO, this.SocketInstance,store)
  },
  methods: {
    cnnServer() {
       this.SocketInstance.open()
      // // Send the "pingServer" event to the server.
      // this.$socket.emit('pingServer', 'PING!')
    },
    //服务器状态不佳时，ping的周期也降低
    ping(interval=5000){
       interval*=(this.discnnCount+1)
       console.log('ping函数被调用，这次的时间间隔是',interval)
       this.pingTimer=setInterval(()=>{
          this.SocketInstance.emit('myPing','alive')
          this.$store.commit('increment')
        },interval)
    },
    delayReconn(latency){
        latency*=this.discnnCount
        // this.SocketInstance.reconnectionDelayMax(latency*1000)
        
        // setTimeout(()=>{
        //   this.SocketInstance.reconncet()
        // },latency)
    },
    myReconn(latency){
      setTimeout(()=>{
        this.SocketInstance.open()
      },latency*1000)
    },
    myClose(){
      setTimeout(()=>{
        this.SocketInstance.close()
      },5000)
    }
  },
  mounted() {
    this.SocketInstance.on('connect',()=>{
        console.log('第一次socket连接成功',this.SocketInstance.id)
        this.ping() //开启心跳检测
    })
    this.SocketInstance.on('devMsg',(data)=>{
        console.log('mqtt中经过node服务器返回的消息监听到的devMsg返回',data)
         this.$store.commit('increment')
    })
    
    // 重连成功才会触发
    this.SocketInstance.on('reconnect',()=>{
        console.log('客户端重连成功') 
        this.ping()      
    })
    // 尝试重连时触发
    this.SocketInstance.on('reconnect_attempt',()=>{
        this.discnnCount++
        console.log('客户端尝试重连') 
         this.delayReconn(5)
        if(this.discnnCount > this.discnnThreshold){
          console.log('客户端重连次数超过门限') 
          this.SocketInstance.close() //关闭后，很长时间后再重新建立连接
          this.discnnCount=0
          this.myReconn(60)
        }            
    })
    //无法重连时触发
    this.SocketInstance.on('reconnect_failed',()=>{
        this.discnnCount++
        console.log('客户端重连失败') 
        this.delayReconn(5)
        if(this.discnnCount > this.discnnThreshold){
           console.log('客户端重连失败后次数超过门限') 
          this.SocketInstance.close() //关闭后，很长时间后再重新建立连接
          this.discnnCount=0
          this.$store.conut=0
          this.myReconn(60)
        }     

    })
    this.SocketInstance.on('ping',()=>{
      console.log('客户端pingping')
    })
    this.SocketInstance.on('pong',(latency)=>{
      console.log('客户端pong延时',latency)
    })

    this.SocketInstance.on('disconnect',(reason)=>{
        console.log('服务端断开连接断开连接',reason)//会自动尝试重连
        //transport close
        clearInterval(this.pingTimer)  
        // this.SocketInstance.close()      
        // if(reason == )
        // /**要在重连失败的时候做判断 */
        // if(this.discnnCount > this.discnnThreshold){
        //   this.SocketInstance.close()
        //   this.discnnCount=0
        // }           
        // this.ping()
    })
  },
}
// export SocketInstance
</script>