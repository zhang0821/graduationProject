<template>
    <div class="sensor">
        <div><span>当前节点的坐标值：x:{{pos.x}},y:{{pos.y}}</span></div>
        <div class="type">
            节点类型
            <li><input type="radio" name="radio" value="tem_hum" v-model="info.checkedType">温湿度</li>
            <li><input type="radio" name="radio" value="smoke"  v-model="info.checkedType">烟雾</li>
            <li><input type="radio" name="radio" value="water"  v-model="info.checkedType">水浸</li>
            <li><input type="radio" name="radio" value="door"  v-model="info.checkedType">门禁</li>
        </div>
        
        <div class="paraConfig">
            <li><span>添加的节点类型是 :{{ info.checkedType }}</span></li>
            <li>
                <input type="textbox"  v-model="info.devEui" placeholder="请输入设备唯一标识号">
            </li>
            <li>
                <input type="textbox" v-model="info.floorId" placeholder="请输入楼层编号">
                <input type="textbox" v-model="info.roomId" placeholder="请输入房间编号">
            </li>

            <li>
                <input type="textbox" v-model="info.temMax"  placeholder="请输入最高温度阈值">
                <input type="textbox" v-model="info.temMin"   placeholder="请输入最低温度阈值">
            </li>
            
            <li>
                <input type="textbox" v-model="info.humiMax" placeholder="请输入最高湿度阈值">
                <input type="textbox" v-model="info.humiMin" placeholder="请输入最低湿度阈值">
            </li>
            
        </div>
        <div class="warn" v-if="warn">{{msg}}</div>

        <div class="ifConfirm">
            <button @click="confirm">确定</button>
            <button  @click="cancle">取消</button>
        </div>
			
			<!--临时显示的节点  -->
        <div :style="{ top:(pos.showy)+'px',left:(pos.showx)+'px'}" v-bind:class="(info.checkedType)" class="ss"></div>
			
    </div>
</template>
<script>
import {get_SsInfo_web,postRegistInfo} from '../js/tools/database'
export default {
    
    name:'nodeRegist',
    data(){
        return{
            info:{
                checkedType:'',
                devEui:'',
                floorId:'',
                roomId:'',
                temMax:'',
                temMin:'',
                humiMax:'',
                humiMin:''
            },
            warn:false,
            msg:''
            
        }

    },
    props:["pos"],
    methods:{
        cancle(){
            this.$emit('child-cancle', false) //子组件向父组件传值，或者使用vue1中，使用dispatch派发，沿着父链向上冒泡触发一个监听的时间
        },
        confirm(){
            console.log('点击确认')
            this.warn=false
            this.msg=''
            for(let item in this.info){
                if(this.info[item] == ''){
                    this.warn=true
                    this.msg='信息未配置完全！'
                }
                //参数合法性检查判断
            }
            if(this.warn == false){
                postRegistInfo(this.info).then((data)=>{
                console.log('服务器端配置函数收到数据',data)
            })
                // console.log('返回配置信息到父组件')
                // this.$emit('postregist', this.info) //返回配置信息到父组件
                // console.log(this.$data)
                // console.log(this.$listeners)
                // this.$emit('child-cancle', false)
            }
             
             // this.$dispatch('postRegistInfo',this.info)
        }
    }
    
}
</script>

<style scoped>
.sensor{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    max-height: 300px;
    transform: translate(-50%,-50%);
    background: rgb(214,190,46);
    border-radius: 5px;
}
.ss{
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50% 50%;
    background: #000;

}
.tem_hum{
    background: #680;
}
.type{
    width: 30%;
    padding: 10px;
    height: auto;
    color: #000;
    float: left;
    margin-left: 5%;

}
.warn{
    width: 100%;
    text-align: center;
    color: red;
}
.paraConfig{
    width: 60%;
    height: auto;
    padding: 10px 0 10px 0;
    color: #000;
    float: left;
    margin-left: 5%;
}
.paraConfig li{
    width: 100%;
    display: flex;
    margin-bottom: 10px;
}
.paraConfig li input{
    display: inline-block;
    flex: 1;
    /* margin-left: 10px; */
    padding: 5px 10px;
}
.ifConfirm {
    width: 70%;
    height: auto;
    margin-top: 5px;
    margin-left: 30%;
    float: left;
}
</style>
