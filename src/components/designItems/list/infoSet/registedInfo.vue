<template>
    <div class="show-registed">
        <h4>已注册楼层&房间信息</h4>
        <ul class="roomBox">
            <li v-for="room in Object.keys(registedInfos)">
                <i class="room-btn" :class="{'hasSetted':(room.registed !=null) }" @click="setThresh(room)">{{room}}</i>
            </li>
        </ul>

        <div v-if="showDetiaSetBox">
             <ul class="roomConfig" :class="{'error':(errorText !=null) }">
                <li >
                    <label for="">最高温度<input type="textbox"  v-model="info.tempMax" placeholder=""></label>
                    <label for="">最低温度<input type="textbox"  v-model="info.tempMin" placeholder=""></label>
                </li>
                <li >
                    <label for="">最高湿度<input type="textbox"  v-model="info.humiMax" placeholder=""></label>
                    <label for="">最低湿度<input type="textbox"  v-model="info.humiMin" placeholder=""></label>
                </li>
                <li >
                    <label for="">氨气阈值<input type="textbox"  v-model="info.nh4Max" placeholder=""></label>
                    <label for="">硫化氢阈值<input type="textbox"  v-model="info.h2sMax" placeholder=""></label>
                </li>
               <p v-if="errorText">{{errorText}}</p>
                
            </ul>
            <div class="btn-save" @click="save">保存配置</div>
        </div>
    </div>
</template>
<script>
export default {
    name:"nodeInfoSet",
    data(){
        return{
            info:{
                tempMax:60,tempMin:-10,humiMax:90, humiMin:10,nh4Max:10,h2sMax:10
            },
            showDetiaSetBox:0,
            errorText:'',
            roomId:0
        }
    },
    props:['registedInfos'],
    created(){
    },
    components:{
    },
    mapState:{

    },
    watch:{
        'registedInfos':(val,oldVal)=>{
            console.log('registedInfos数据变化','之前是',Object.keys(oldVal),'现在是',Object.keys(val))
        }
    },
    methods:{
        validInfo(){
            for(var item in this.info){
                if(this.info[item] == null){
                    return false
                }
            
            }
            return true
        },
        save(){
           this.errorText = null
           if(!this.validInfo()){
                this.errorText='填写信息有误'
                return 
            }
            
            this.$emit('child-info-save','room',this.roomId,this.info)
            this.showDetiaSetBox=0;
            

        },
        /**页面元素内容的强制刷新 */
        renderRefresh(){
            this.$forceUpdate()
        },
        /**具体阈值信息配置 */
        setThresh(room){
            this.showDetiaSetBox=1
            this.roomId=room
        }
    }

}
</script>
<style lang="scss" scoped>
.show-registed{
    text-align: center;
    margin-top: 10px;
    width: 100%;
    color:#fff;
    h4{
        border-bottom: 1px solid #fff;
    }
    .roomBox{
        display: flex;
        li{

        }
        .room-btn{
            display: inline-block;
            padding: 2px 10px;
            border: 1px solid #fff;
            border-radius: 5px;
            &:hover{
                cursor: pointer;
            }
            &.hasSetted{
                background:#fff;
                color:#000;
            }
        }
    }
    
    .roomConfig{
        width: 100%;
        height: auto;
        color: #000;
        margin-top: 10px;
        li{
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin-bottom: 10px;
            label{
                margin-right: 10px;
               input{
                width: 100px;
                padding: 2px 5px;
                border-radius: 10px;
                outline: none;
                text-align: center;
               }
            }
        }
        p{
            color: red;
            padding: 5px;
            text-align: center;
        }
        &.error li input{
            border:1px soild red;
        }
    }
    .btn-save{
        margin: 10px auto;
        text-align: center;
        width: 8em;
        padding: 10px 20px;
        border-radius: 20px;
        border:1px solid #fff;
        &:hover{
            cursor: pointer;
        }
    }
}
</style>