/**
*mqtt嵌入
**/
const mqtt = require('mqtt')
const myredis=require('./myredis')
const socket=require('./socket')
const sockEvent=socket.socketEvent
const fsTool = require('../routes/fsTool')
// const mqttClient = mqtt.connect('mqtt://10.149.65.47:1883')
const mqttClient = mqtt.connect('mqtt://10.149.65.47:1883')


mqttClient.on('connect', function () {
	console.log('成功连接mqtt服务器');
    mqttClient.subscribe('loraPub',{qos:2})
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
     if(arr.length >2){
        return{
            dev_eui:arr[0],
            vals:[arr[1],arr[2]] //温度、湿度；氨气、硫化氢
        }
     }else{
        return {
            dev_eui:arr[0],
            status:Number(arr[1])
        }
     }
     
 }

 let msgHander=(msg,timeObj)=>{
     if(msg){
        let info=devInfoObj(msg)
        if(info.dev_eui != '080000000000001b'){
            myredis.nodeSearch(info.dev_eui).then((resultObj)=>{
                //判断是否超过阈值或者异常
                console.log('该节点对应的信息是,',resultObj)
                let emailFlag=0,text='moren',roomKey=resultObj.floor_id+'-'+resultObj.room_id
                if((resultObj.type == 'smoke' || resultObj.type == 'water') && info.status==0){
                    // 启动邮件服务
                    emailFlag=1
                    text=roomKey+'室烟雾报警'
                    // 报警信息文本是：？？
                }else{
                    //查找阈值信息
                    if(resultObj.type == 'tem_hum' || resultObj.type =='air'){
                        //文件读取
                        fsTool.readFile(resultObj.area.area).then((data)=>{
                            console.log('该用户下的所有数据信息是：',data)
                            let thresholdObj=data.designRoomInfo[roomKey]
                            if(resultObj.type == 'tem_hum'){
                                let [tem,hum]=info.vals
                                if(tem>thresholdObj.tempMax || tem<thresholdObj.tempMin){
                                    text+='温度'+tem+'℃超过阈值'
                                    info['temp_value']=tem
                                    info['humi_value']=hum
                                    info['status']=0
                                    emailFlag=1
                                }
                                if(hum>thresholdObj.humiMax || hum<thresholdObj.humiMin){
                                    text+='湿度'+hum+'Rh%超过阈值'
                                    info['temp_value']=tem
                                    info['humi_value']=hum
                                    info['status']=0
                                    emailFlag=1
                                }
                            }else{
                                let [nh4,h2s]=info.vals
                                if(nh4>thresholdObj.nh4Max){
                                    text+='氨气浓度:'+nh4+'ppm,超过阈值'
                                    info['nh4_value']=nh4
                                    info['h2s_value']=h2s
                                    info['status']=0
                                    emailFlag=1
                                }
                                if(hum>thresholdObj.h2sMax){
                                    text+='硫化氢浓度:'+h2s+'ppm,超过阈值'
                                    info['nh4_value']=nh4
                                    info['h2s_value']=h2s
                                    info['status']=0
                                    emailFlag=1
                                }
                            }
                           
                            // if(data)//超过阈值
                            // myredis.
                            // emailFlag=1
                            // text=resultObj.floor_id+'-'+resultObj.room_id+'室烟雾报警'
                        })

                    }
                    
                }
                if(emailFlag){
                    emailFlag=0
                    myredis.mailCallback(resultObj.area.area,text)
                }
                // 发送节点信息到客户端
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