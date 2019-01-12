// 此文件用于显示对每个放入绘制区域的组件进行配置,被design.vue文件引用
<template>

    <div class="nodeSetBox">
        <!-- 节点信息的相关配置 -->
        <ul v-if="curtype.rangeType == 'NODE'">
            <!-- 显示要注册的节点信息 -->
            <node-info-set :node-type="curtype.nodeType" :node-id="curtype.itemId" v-on:child-info-save="saveNodeSet"/>
            <!-- 如果有房间被注册，则显示此处用于注册房间 -->
            <registed-info :registed-infos-obj="registedInfosObj" />
        </ul>

        <!-- 布局相关的信息配置 -->
        <ul v-if="curtype.rangeType == 'LAYOUT'">
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

        }
    },
    props:['curtype'],
    created(){

    },
    components:{
        ...nodeSetInfo,
    },
    computed:mapState({
        registedInfosObj:state=>state.designStore.designRoomInfo
    }),
    methods:{
        ...mapMutations({
            setInfoStore:'designStore/setInfoStore',
            addNodeInfo:'designStore/addNodes'
        }),
        saveNodeSet(id,obj){

            console.log('序列化参数',JSON.stringify(obj))

            let inserObj=Object.assign(obj,{'id':id})

            console.log('配置信息提交,配置的id是',id,"配置的信息是",obj,'inserObj:',JSON.stringify(inserObj))
            this.addNodeInfo(inserObj)
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

