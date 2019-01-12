<template>
    <div class="setDetialBox">
        <div>
            <h4 v-if="nodeType == 'tem_hum'">温湿度节点配置</h4>
            <h4 v-else-if="nodeType == 'smoke'">烟雾节点配置</h4>
            <h4 v-else-if="nodeType == 'door'">门禁节点配置</h4>
            <h4 v-else>气体节点配置</h4>
         
            <ul class="paraConfig" :class="{'error':(errorText !=null) }">
                <li >
                    <input type="textbox"  v-model="info.dev_eui" placeholder="唯一标识号">
                </li>
                <li>
                    <input type="textbox" v-model="info.floor_id" placeholder="楼层编号">
                    <input type="textbox" v-model="info.room_id" placeholder="房间编号">
                </li>
               <p v-if="errorText">{{errorText}}</p>
                
            </ul>
            <div class="btn-save" @click="save">保存配置</div>
        </div>
    </div>
</template>

<script>
import utils from '../../utils'
export default {
    name:"nodeInfoSet",
    data(){
        return{
            errorText:null,
            info:{
                
            }
        }
    },
    props:['nodeType','nodeId'],
    components:{
        ...utils
    },
    methods:{
        save(){
            if(!this.info.floor_id || !this.info.room_id || !this.info.dev_eui){
                this.errorText='请将信息填写完全'
                return 
            }
            this.$emit('child-info-save',this.nodeId,this.info)
            this.errorText = null
            
        }
    }

}
</script>
<style lang="scss" scoped>
.setDetialBox{
    display: flex;
    flex-direction: column;
    h4{
        color: #fff;
        text-align: center;
        padding-bottom: 5px;
        border-bottom: 1px solid #fff;
    }
    .paraConfig{
        width: 100%;
        height: auto;
        color: #000;
        li{
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin-bottom: 10px;
            input{
                margin-right: 10px;
                padding: 2px 5px;
                border-radius: 10px;
                outline: none;
                text-align: center;
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
        background: #fff;
        &:hover{
            cursor: pointer;
        }
    }
}


</style>



