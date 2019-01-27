<template>
  
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
      SocketInstance:'',
    }
  },
  props:['username'],

  created() { 
    let usr=this.username 
    console.log('mqtt子组件接收到的传入的用户名参数',usr)
    this.SocketInstance= socketio(this.wsuri,{
    autoConnect: false,
    // reconnection:false,
    reconnectionDelay:3000,
    reconnectionAttempts:8,
    query:{
        username:usr
      }
    })    
    Vue.use(VueSocketIO, this.SocketInstance,store)
    this.cnnServer()
  },
  methods: {
     cnnServer() {
       console.log('进入连接服务端Mqtt')
       this.SocketInstance.open()
      // // Send the "pingServer" event to the server.
      // this.$socket.emit('pingServer', 'PING!')
    },
  },
  mounted() {
    this.SocketInstance.on('connect',()=>{
        console.log('mqtt连接成功')
    })
    this.SocketInstance.on('devMsg',(data)=>{
        let dataObj=JSON.parse(data)
        if(typeof dataObj == 'object'){
            this.$store.commit('designStore/updateNodesList',dataObj)
        }
    })
  },
  destroyed() {
    this.SocketInstance.close()
  },
}
</script>