/**
*mqtt嵌入
**/
const mqtt = require('mqtt')
const myredis=require('./myredis')
const socket=require('./socket')
const sockEvent=socket.socketEvent

const mqttClient = mqtt.connect('mqtt://10.149.72.156:1883')

mqttClient.on('connect', function () {
	console.log('成功连接mqtt服务器');
	mqttClient.subscribe('topics',{qos:2})
});

mqttClient.on('message', function (topic, message) {
    switch(topic) {
        case 'topics':
            msgHander(message.toString())
            break;
        case 'close':
            mqttClient.end()
            break;
	}
 }); 

 let devInfoObj=(msg)=>{
     let arr=msg.split("#")
     return {
         dev_eui:arr[0],
         value:arr[1]        
     }
 }

 let msgHander=(msg)=>{
     if(msg){
        let info=devInfoObj(msg)
        myredis.nodeSearch(info.dev_eui).then((resultObj)=>{
            info=Object.assign(info,resultObj)
            console.log("mqtt收到消息后进入信息广播发送")
            sockEvent.unpdateMsgToClient(info,resultObj.area)
        }).catch((err)=>{
            console.log('未取到数据，无信息发送')
        })
     }
 }
 module.exports={
    mqttClient,
    socket
 } 