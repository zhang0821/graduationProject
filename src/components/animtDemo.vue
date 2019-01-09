<template>
    <div>
        <!-- <div v-for="(room,index) in infos" :key="index" > -->
            <div v-if="infos.length !=0">
                <div v-for="item in infos" >
                <!-- <audio src="music/fire.mp3" loop="loop" hidden="hidden" v-if="item.type=='smoke' && item.status==0 &&  !musicPlay" autoplay></audio> -->
                <!-- status:1代表正常，online：0代表离线 -->
                
                    <div class="sensor" v-bind:class="[item.type,{'warn':(item.online==1?!item.status:false)},
                            {'offLine':((item.type != 'tem_hum' || (item.type == 'tem_hum' && item.temp_value== null)) ? !item.online : ((item.temp_value != 0 || item.humi_value != 0 ||item.h2s_value != 0 || item.nh4_value != 0) ? false:true))},
                            {'star': item.status=='smoke' && item.status}]"  
                            v-bind:style="{ top: (Math.round(item.posy*sensorContainerHeight,2))+'px', left:(Math.round(item.posx*sensorContainerWidth,2))+'px' }" >
                            <span v-if="item.type === 'tem_hum' && (item.temp_value != 0 || item.humi_value != 0) ">
                                    {{item.temp_value}}<br>{{item.humi_value}}
                            </span>
                            <span v-else-if="item.type === 'air'  && (item.h2s_value != 0 || item.nh4_value != 0)">
                                {{item.h2s_value}}<br>{{item.nh4_value}}                      
                            </span>
                            <span v-else>

                            </span>
                    </div>

                </div>
            </div>
            
        <!-- </div> -->
    </div>
    
</template>
<script>

export default {
    name:'animtDemo',
    data(){
        return{
            // sensorContainerHeight:0,
            // sensorContainerWidth:0,
        }
    },
    props:['infos','sensorContainerHeight','sensorContainerWidth'],
    methods:{

    },
    beforeCreate() {
        // 在此生命周期中，还未获取到父组件传递的参数
        // console.log('beforeCreate是animatede组件中收到消息',this.infos)
    },
    created() {
        console.log('animatede组件中收到消息',this.infos)
    },
    mounted() {
        
    },
    destroyed() {
        
    },
}
</script>

<style scoped>
@keyframes twinkling{
    0%{
      opacity:0.1; /*透明度为0*/
    }
    50%{
       opacity: 0.5
    }
    70%{
       opacity: 0.7
    }
    90%{
       opacity: 0.9
    }
   100%{
      opacity:1; /*透明度为1*/
  
   }
  }
.sensor{
    position: absolute;
    text-align:center;
    width:30px;height:30px;border-radius:50% 50%;
    animation: twinkling 4s infinite ease-in-out;
}


.sensor.door{
    background-color: #8A5B47;
}
.sensor.door.offLine{
    background: #999;
    animation:none;
}
.sensor.door.warn{
        background-color: #DC210F;
        animation: twinkling 1s infinite ease-in-out; 
    }


.sensor.water{
    background-color: rgba(0,86,97,.9);
}
 .sensor.water.offLine{
    background: #999;
        animation:none;
}
.sensor.water.warn{
    background-color: #DC210F;
    animation: twinkling 1s infinite ease-in-out; 
}



.sensor.tem_hum{
    width:60px;height:40px;border-radius:15px;
    background-color: #446F9E;
}
.sensor.tem_hum.offLine{
    background: #999;
    animation:none;
}
.sensor.tem_hum.warn{
    background-color: #DC210F;
    animation: twinkling 1s infinite ease-in-out; 
}
               



.sensor.smoke{
    width: 0;height: 0;border-left: 14px solid transparent;border-right: 14px solid transparent; border-bottom: 24px solid rgba(214,190,46,0.6);
    border-radius: 0;
}

.sensor.smoke.offLine{
    background:none;
    border-bottom-color:#999;
    animation:none;
}

.sensor.smoke.warn{
    animation: twinkling 1s infinite ease-in-out;
    border-color: red transparent transparent transparent;
    border-style: solid;
    border-top-width: 5px;
    border-right-width: 10px;
    border-left-width: 10px;
    height: 0;
    margin-top: 5px;
    margin-bottom: 3.21429px;
    width: 0;
}

.sensor.smoke.warn:before,.sensor.smoke.warn:after {
    border-color: red transparent transparent transparent;
    border-style: solid;
    border-top-width: 5px;
    border-right-width: 10px;
    border-left-width: 10px;
    content: '';
    display: block;
    height: 0;
    left: -10px;
    position: absolute;
    top: -5px;
    width: 0;
}
.sensor.smoke.warn:before{
    transform: rotate(70deg);
}
.sensor.smoke.warn:after {
    transform: rotate(-70deg);
}   

 



</style>
