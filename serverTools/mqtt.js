/**
*mqtt嵌入
**/
const mqtt = require('mqtt')
const myredis=require('./myredis')
const socket=require('./socket')
const sockEvent=socket.socketEvent
const fsTool = require('../routes/fsTool')
// const mqttClient = mqtt.connect('mqtt://10.149.65.47:1883')
const mqttClient = mqtt.connect('mqtt://10.149.55.92:1883')


mqttClient.on('connect', function () {
	console.log('成功连接mqtt服务器');
    mqttClient.subscribe('loradata',{qos:2})
});

mqttClient.on('message', function (topic, message) {
    switch(topic) {
        case 'loradata':
            let time={
                time:(new Date()).toString(),
                timestamp:(new Date()).getTime()
            }
            msgHander(message,time)
            break;
        case 'close':
            mqttClient.end()
            break;
	}
 }); 

 let devInfoObj=(msg)=>{
    let dev_eui= msg.toString("utf8",0,16) 
    console.log('订阅的loraPub原始消息',msg,'长度是：',msg.length,'转为其他形式后节点编号是：',msg.toString("utf8",0,17),'dev_eui',dev_eui)
    let returnObj
    if(msg.length>18){
        let data=msg.slice(17,msg.length)
        console.log('data是：',data)
        console.log('buffer中保存数据的地方是：',data,'长度：',data.length,"第一位转为unit16是：",data.readInt16BE(0))
        let temp=data.readInt16BE(0)
        let humi=data.readInt16BE(2)
        console.log('第一步humi是，',humi)

        temp= temp & 0xfffc
        humi= humi & 0xfffc
        console.log('第2步humi是，',humi)
        let temp_value_get=(-46.85+175.72*temp/65536.0).toFixed(2)
        let humi_value_get=(-6.0+125.0*humi/65536.0).toFixed(2)
        console.log('temp_value_get温度是：',temp_value_get,'湿度是',humi_value_get)
        returnObj={
            dev_eui:dev_eui,
            vals:[temp_value_get,humi_value_get] //温度、湿度；氨气、硫化氢
        }

    }else{
        let val=msg.slice(17,18)
        let myVal=val.readUInt8(0)
        returnObj= {
            dev_eui:dev_eui,
            status:Number(myVal)
        }
    } 
    console.log('返回的节点数据信息是是：',returnObj)
    return returnObj    
 }

 let msgHander=(msg,timeObj)=>{
     if(msg){
        let info=devInfoObj(msg)
        myredis.nodeSearch(info.dev_eui).then((resultObj)=>{
            //判断是否超过阈值或者异常
            // console.log('该节点对应的信息是,',resultObj)
            let emailFlag=0,text='',roomKey=resultObj.floor_id+'-'+resultObj.room_id
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
                        data=JSON.parse(data)
                        // console.log('该用户下的所有数据信息是：',data.designRoomInfo)
                        let thresholdObj=data.designRoomInfo[roomKey]
                        // console.log(`该节点对应房间是${roomKey},阈值信息是`)
                        // console.log(thresholdObj)
                        if(resultObj.type == 'tem_hum'){
                            let [tem,hum]=info.vals
                            info['temp_value']=tem
                            info['humi_value']=hum
                            info['status']=1
                            console.log('传入的节点温湿度的信息是',tem,hum,'阈值温度是',thresholdObj.tempMax,thresholdObj.tempMin,'湿度阈值是',thresholdObj.humiMax,thresholdObj.humiMin)
                            if(tem>thresholdObj.tempMax || tem<thresholdObj.tempMin){
                                text+='温度'+tem+'℃超过阈值'
                                info['status']=0
                                emailFlag=1
                            }
                            if(hum>thresholdObj.humiMax || hum<thresholdObj.humiMin){
                                text+='湿度'+hum+'Rh%超过阈值'
                                info['status']=0
                                emailFlag=1
                            }
                        }else{
                            let [nh4,h2s]=info.vals
                            info['status']=1
                            info['nh4_value']=nh4
                            info['h2s_value']=h2s
                            if(nh4>thresholdObj.nh4Max){
                                text+='氨气浓度:'+nh4+'ppm,超过阈值'
                                info['status']=0
                                emailFlag=1
                            }
                            if(h2s>thresholdObj.h2sMax){
                                text+='硫化氢浓度:'+h2s+'ppm,超过阈值'
                                info['status']=0
                                emailFlag=1
                            }
                        }
                        if(emailFlag){
                            emailFlag=0
                            //先暂时不发送
                            // myredis.mailCallback(resultObj.area.area,text)
                        }
                        info=Object.assign(info,resultObj,timeObj)
                        console.log('将温湿度信息发送至前端页面：！！！！',info)
                        sockEvent.updateMsgToClient(info,resultObj.area)                            
                        
                        // if(data)//超过阈值
                        // myredis.
                        // emailFlag=1
                        // text=resultObj.floor_id+'-'+resultObj.room_id+'室烟雾报警'
                    })

                }
                
            }
            // console.log('是否发送邮件的标志位是：',emailFlag,'告警文本是',text)
            if(emailFlag){
                emailFlag=0
                // 暂时不发送
                // myredis.mailCallback(resultObj.area.area,text)
            }
            // 发送节点信息到客户端
            info=Object.assign(info,resultObj,timeObj)
            console.log('即时类节点返回给前端的信息是',info,'要发送至的客户端名称是',resultObj.area)
            if(resultObj.type!='tem_hum' && resultObj.type!='air'){
                // console.log('统一发送处，发送数据到前端页面')
                sockEvent.updateMsgToClient(info,resultObj.area)
            }
        }).catch((err)=>{
            console.log('未取到数据，无信息发送')
        })
     }
 }
 module.exports={
    mqttClient,
    socket
 } 