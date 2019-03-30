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
import {mapState} from 'vuex'
export default {
    name:"nodeInfoSet",
    data(){
        return{
            errorText:null,
            info:{
                
            }
        }
    },
    props:['nodeType','nodeId','tabId'],
    components:{
        ...utils
    },
    created(){
        console.log('显示信息配置界面，传入参数是：nodeType',this.nodeType,'nodeId:',this.nodeId,'tabId:',this.tabId)
        this.info=Object.assign(this.info,this.$store.state.designStore.pageTabs[this.tabId].designComponents[this.nodeId])
        console.log('该节点对应的相关信息是：',this.info)
    },
    computed:{
        ...mapState('designStore',{
            nodeInfoObj:state=>state.pageTabs,
        })
    },
    methods:{
        checkRepeat(sid){
            let tabL=Object.keys(this.nodeInfoObj)
            console.log('要判断的sid是',sid,'tabL是：',tabL)
            for(let tab of tabL){
                let nodeArr=this.nodeInfoObj[tab].designComponents
                console.log('nodeArr是：',nodeArr)
                for(let i=0;i<nodeArr.length;i++){
                    console.log('当前要判断的dev_eui是：',nodeArr[i].dev_eui)
                    if(nodeArr[i].dev_eui == sid)
                        return true
                }
            }
            return false
        },
        save(){
            if(!this.info.floor_id || !this.info.room_id || !this.info.dev_eui){
                this.errorText='请将信息填写完全'
                return 
            }
            //查询该节点是否已经存在
            console.log('当前要保存节点是',this.info.dev_eui,'是否已经存在:',)
            if(this.checkRepeat(this.info.dev_eui)){//该节点已存在
                this.errorText='该节点编号已被注册'
            }else{
                this.$emit('child-info-save','dev',this.nodeId,this.info)
                this.errorText = null
            }
            
            
        }
    }

}
</script>
<style lang="scss" scoped>
.setDetialBox{
    display: flex;
    flex-direction: column;
    h4{
        color: #16A085;
        text-align: center;
        padding-bottom: 5px;
        border-bottom: 1px solid #16A085;
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
            color: #16A085;
            padding: 5px;
            text-align: center;
        }
        &.error li input{
            border:1px soild #16A085;
        }
    }
    .btn-save{
        margin: 10px auto;
        text-align: center;
        width: 8em;
        padding: 10px 20px;
        border-radius: 20px;
        background: #16A085;
        color:#fff;
        &:hover{
            cursor: pointer;
        }
    }
}


</style>



