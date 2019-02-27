// 此文件用于显示对每个放入绘制区域的组件进行配置,被design.vue文件引用
<template>

    <div class="nodeSetBox">
        <!-- 节点信息的相关配置 -->
        <ul v-if="toolBoxInfo.rangeType == 'NODE'">
            <!-- 显示要注册的节点信息 -->
            <node-info-set :node-type="toolBoxInfo.nodeType" :tabId="toolBoxInfo.tabId" :node-id="toolBoxInfo.nodeId" v-on:child-info-save="saveNodeSet"/>
            
            <!-- 如果有房间被注册，则显示此处用于注册房间 -->
            <div v-show="Object.keys(registedInfosObj).length>0">
                 <registed-info v-bind:registed-infos="registedInfosObj"  ref="childregist" v-on:child-info-save="saveNodeSet"/>
            </div>
           
        </ul>

        <!-- 布局相关的信息配置 -->
        <ul v-if="toolBoxInfo.rangeType == 'LAYOUT'">
            布局相关
        </ul>

        <!-- <div>提交信息</div> -->
        
    </div>
</template>
<script>
import { mapState,mapMutations } from 'vuex'
import nodeSetInfo from './list/infoSet'
import { stringify } from 'querystring';
export default {
    name:'infoSetBox',
    data(){
        return{
            showflag:0,
        }
    },
    props:['toolBoxInfo'],
    created(){

    },
    components:{
        ...nodeSetInfo,
    },
    computed:mapState({
        registedInfosObj:state=>state.designStore.designRoomInfo
    }),
    methods:{
        ...mapMutations('designStore',[
            'setInfoStore',
            'addNodes',
            'setRoomInfo'
        ]),
        saveNodeSet(type,id,obj){
            console.log("触发saveNodeSet,要保存的信息是obj:",obj)
            this.$forceUpdate()
            let inserObj=null
            if(type == 'dev'){
                inserObj=Object.assign(obj,{'id':id})
                    console.log('NodeInfoSet中提交配置，配置信息提交,配置的id是',id,"配置的信息是",JSON.stringify(obj),'inserObj:',JSON.stringify(inserObj))
                this.addNodes(inserObj)
                    console.log('registedInfosObj的值在点击提交后是',this.registedInfosObj,'','长度:',Object.keys(this.registedInfosObj).length)
            }else{
                    inserObj=Object.assign(obj,{'room_id':id,'registed':1})
                    console.log('registed中提交配置，配置信息提交信息inserObj:',JSON.stringify(inserObj))
                    this.setRoomInfo(inserObj)
            }

            this.$refs.childregist.renderRefresh(inserObj) 
        }
    }
}
</script>
<style lang="scss" scoped>
.nodeSetBox{
    // position: relative;
    height: 100%;
    ul{
        margin-bottom: 50px;
        overflow-y:auto;
    }

}
</style>

