/**
*mqtt嵌入
**/
const mqtt = require('mqtt')
const myredis=require('./myredis')
const socket=require('./socket')
const email=require('./message')
const sockEvent=socket.socketEvent

// const mqttClient = mqtt.connect('mqtt://10.149.65.47:1883')
const mqttClient = mqtt.connect('mqtt://10.149.65.47:1883')


mqttClient.on('connect', function () {
	console.log('成功连接mqtt服务器');
    mqttClient.subscribe('loraPub',{qos:2})
    // email.sendMail('839829400@qq.com', 'subject', 'html')
});

mqttClient.on('message', function (topic, message) {
    switch(topic) {
        case 'loraPub':
            let time={
                time:(new Date()).toString(),
                timestamp:(new Date()).getTime()
            }
            console.log('订阅的loraPub收到消息',message.toString())
            msgHander(message.toString(),time)
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
         status:Number(arr[1])
     }
 }

 let msgHander=(msg,timeObj)=>{
     if(msg){
        let info=devInfoObj(msg)
        if(info.dev_eui != '080000000000001b'){
            myredis.nodeSearch(info.dev_eui).then((resultObj)=>{
                info=Object.assign(info,resultObj,timeObj)
                sockEvent.updateMsgToClient(info,resultObj.area)
            }).catch((err)=>{
                console.log('未取到数据，无信息发送')
            })
        } 
     }
 }
 module.exports={
    mqttClient,
    socket
 } 