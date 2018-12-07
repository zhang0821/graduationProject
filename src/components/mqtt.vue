<template>
    <button >进入mqtt测试</button>
</template>

<script>
var mqtt = require('mqtt')
import mws from '../js/tools/mqttws31.js'
export default {
    name:'mqtt',
    data(){
        return{
            client: mqtt.connect('mqtt://10.149.72.156:1883'),  // 第三个参数是clientID可以为空
            topic:'topics'
        }

    },
    created: function() {

        var clientws =new Paho.MQTT.Client('10.149.72.156',1883)
        clientws.connect({onSuccess: this.onConnect})

        this.client.on('connect', function () {
            console.log('成功连接mqtt服务器');
            this.client.subscribe(this.topic,{qos:2});
        });
        this.listenMessage()
        
    },
    methods:{
        listenMessage(){
            client.on('message', function (topic, message) {
                console.log('mqtt服务器返回的数据:topic',topic,'message',message)
                // switch(topic) {

                // }
            })

        },
        onConnect: function() {
            console.log('onConnected');
        }
       
    },
    
}
</script>


