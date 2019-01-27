<template>
    <div class="sensorparsebox" ref="sensorparsebox" @click="setParam">
        <div v-if="infos.length !=0" >
            <div v-for="item in infos" >
                <div :class="item.type"  class="nodes"
                        :style="{ top: (Math.round(item.posy*sensorContainerHeight,2))-15+'px', 
                                    left:(Math.round(item.posx*sensorContainerWidth,2))-20+'px',
                                    background:item.color }" 
                        :data-arrId="item.id"  :data-tabIndex="item.tabIndex">
                        <!-- {{item.tabIndex+'-'+item.id}} -->
                        <i v-if="item.dev_eui">{{item.dev_eui}}</i>
                        <i v-else>{{item.type}}</i>
                </div>

            </div>
        </div>
    </div>
    
</template>
<script>
import { mapMutations } from 'vuex';
export default {
    name:'animtDemo',
    data(){
        return{
            sensorContainerHeight:0,
            sensorContainerWidth:0,
        }
    },
    props:['infos'],
    created() {
        const _self = this
        _self.$nextTick(()=>{ //也可在mounted中执行
             _self.sensorContainerWidth=_self.$refs.sensorparsebox.clientWidth
            _self.sensorContainerHeight=_self.$refs.sensorparsebox.clientHeight
        })
    },
    computed:mapMutations({

    }),
    methods:{
        ...mapMutations({
            showToolsBoxChange:'designStore/showToolsBoxChange'
        }),
        setParam(e){
            let itemId=e.target.getAttribute('data-arrId'),
                tabId=e.target.getAttribute('data-tabIndex'),
                itemType=e.target.className
            console.log('nodesShow中的setparam被调用，此时获取到tabId是',tabId)
            if(itemId != null || tabId!=null){
                this.showToolsBoxChange({show:1,rangeType:'NODE',nodeType:itemType,nodeId:itemId,tabId:tabId})
            }else{
                this.showToolsBoxChange({show:0,type:null,rangeType:null,nodeId:null,tabId:tabId})
            }
            this.$nextTick(()=>{ //也可在mounted中执行
                this.sensorContainerWidth=this.$refs.sensorparsebox.clientWidth
                this.sensorContainerHeight=this.$refs.sensorparsebox.clientHeight
            })
        }
    },
    beforeCreate() {
    },
   
    watch:{
      
    //     // 父级异步加载的数据 props 方式给到 当前子级
    //   fatherAjaxData: function (val, oldVal) {
    //     this.$nextTick(() => {
    //       console.log('监听到已异步加载的fatherAjaxData数据 已有值');
    //     });

    }, 
    mounted() {
       window.onresize = () => { 
        this.$nextTick(()=>{ //也可在mounted中执行
             this.sensorContainerWidth=this.$refs.sensorparsebox.clientWidth
             this.sensorContainerHeight=this.$refs.sensorparsebox.clientHeight
        })
      }
       this.sensorContainerWidth=this.$refs.sensorparsebox.clientWidth
             this.sensorContainerHeight=this.$refs.sensorparsebox.clientHeight
    },
    destroyed() {
        
    },
}
</script>


<style lang="scss" scoped>
@import "@/assets/css/color.scss";
$water:rgba(0,86,97,.9);
$door:#8A5B47;
$temHum: #446F9E;
$smoke:rgba(214,190,46,0.6);
 
.sensorparsebox{
    .nodes{
        cursor: pointer;
    }
    width: 100%;
    height: 100%;
    position: relative;
    div{
        position: absolute;
        text-align:center;
        width:30px;height:30px;border-radius:50% 50%;
        &.door{
            background-color: $door;
        }
        &.water{
            background-color: $water;
        }
        &.tem_hum{
            width:60px;height:40px;border-radius:15px;
            background-color:$temHum;
        }
        &.smoke{
            width: 0;height: 0;border-left: 14px solid transparent;border-right: 14px solid transparent; border-bottom: 24px solid $smoke;
            border-radius: 0;
        }
    }
}
</style>
