<template>
    <div class="sensorparsebox" ref="sensorparsebox" @click="setParam" >
        <div v-if="infos.length !=0" >
            <div v-for="item in infos" v-if="design === 'design'">
                    <div  :class="item.type"  class="nodes"
                            :style="{ top: (Math.round(item.posy*sensorContainerHeight,2))-15+'px', 
                                        left:(Math.round(item.posx*sensorContainerWidth,2))-20+'px'}" 
                            draggable="true" @dragstart="dragStart" @contextmenu.prevent="showMenu(item.id)"
                            :data-arrId="item.id"  :data-tabIndex="item.tabIndex" >
                            <!-- {{item.tabIndex+'-'+item.id}} -->
                            <i v-if="item.dev_eui">{{item.dev_eui}}</i>
                            <i v-else>{{item.type}}</i>

                            <!-- 节点右键菜单弹出 -->
                            <vue-context-menu :contextMenuData="contextMenuData"
                            :transferIndex="transferIndex"
                            @delete="deleteItem({tabIndex:item.tabIndex,id:item.id})"
                            @modify="modifyItem"></vue-context-menu>
                    </div>
            </div>
            
            <div v-else>
                <div class="nodes" :class="[item.type,item.status === 0 ? 'warn' : (item.status === 1 ? 'normal' :'offLine')]"

                        :style="{ top: (Math.round(item.posy*sensorContainerHeight,2))-15+'px', 
                                    left:(Math.round(item.posx*sensorContainerWidth,2))-20+'px',
                                    }" >
                                    <section v-if="item.type == 'tem_hum'">
                                        <i v-if="item.temp">{{item.temp}}<br>{{item.humi}}</i>
                                        <i v-else>{{item.dev_eui}}</i>
                                    </section>
                                    <section v-else-if="item.type == 'air'">
                                        <i v-if="item.nh4">{{item.nh4}}<br>{{item.h2s}}</i>
                                        <i v-else>{{item.dev_eui}}</i>
                                    </section>
                                    <section v-else>
                                        <i v-if="!item.status">{{item.dev_eui}}</i>
                                    </section>

                                    <div v-if="listenNodesChange%2 == 0">
                                        <!-- 用于强制刷新页面 -->

                                    </div>
  
                </div>
            </div>
        </div>
     
    </div>
    
</template>
<script>
import { mapMutations, mapState } from 'vuex';

export default {
    name:'animtDemo',
    data(){
        return{
            sensorContainerHeight:0,
            sensorContainerWidth:0,

            transferIndex: null, // Show the menu that was clicked
            contextMenuData: {
                menuName: 'demo',
                axis: {
                    x: null,
                    y: null
                },
                menulists: [
                    {
                    fnHandler: 'delete',
                    icoName: 'fa fa-fw',
                    btnName: '移除'
                    },
                    {
                    fnHandler: 'modify',
                    icoName: 'fa fa-fw',
                    btnName: '样式修改'
                    }
                ]
            }
        }
    },
    props:['infos','design'],
    created() {
        console.log('nodesshow传入的design参数是,',this.design)
        const _self = this
        _self.$nextTick(()=>{ //也可在mounted中执行
             _self.sensorContainerWidth=_self.$refs.sensorparsebox.clientWidth
            _self.sensorContainerHeight=_self.$refs.sensorparsebox.clientHeight
        })
    },
    computed:{
        listenNodesChange(){
            return this.$store.state.dataTrans.listenChange
        }
    },
    updated(){
         //只要页面数据更新造成页面重新渲染，就会被调用
    },
    watch:{
        listenNodesChange:{
            handler:function(val,oldVal){
                console.log('nodesshow监听到节点数据有变化')
                this.$forceUpdate()
            },
            deep:true,
            immediate: true
        }
    },
    methods:{
        ...mapMutations({
            showToolsBoxChange:'designStore/showToolsBoxChange',
             deleteItem:'designStore/deleteItem'
        }),
        /**点击配置参数 */
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
        },
        /**拖拽事件 */
        dragStart(e) {
            let info = {
                compType:'node',

                changePos:true,
                tabId:e.target.getAttribute('data-tabIndex'),
                itemType:e.target.className,
                itemId:e.target.getAttribute('data-arrId'),

                width:e.target.offsetWidth,
                height:e.target.offsetHeight,

            } 
            console.log('节点的再次拖拽事件')
            e.dataTransfer.setData('info', JSON.stringify(info))
        },
        /**右键菜单 */
        showMenu (index) {
            this.transferIndex = index // tranfer index to child component
            event.preventDefault()
            var x = event.clientX
            var y = event.clientY
            this.contextMenuData.axis = {
            x, y
            }
        },
        modifyItem () {
            console.log('修改样式')
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
            &.offLine{
                background-color: #999;
            }
            &.warn{
                background-color: red;
            }
            
        }
        &.water{
            background-color: $water;
            &.offLine{
                background-color: #999;
            }
            &.warn{
                background-color: red;
            }
            
        }
        &.tem_hum{
            width:60px;height:40px;border-radius:15px;
            background-color:$temHum;
            &.offLine{
                background-color: #999;
            }
            &.warn{
                background-color: red;
            }
           
        }
        &.smoke{
            width: 0;height: 0;border-left: 14px solid transparent;border-right: 14px solid transparent; border-bottom: 24px solid $smoke;
            border-radius: 0;
            &.offLine{
               border-bottom-color: #999;
            }
            &.warn{
                border-color: red transparent transparent transparent;
                border-style: solid;
                border-top-width: 5px;
                border-right-width: 10px;
                border-left-width: 10px;
                height: 0;
                margin-top: 5px;
                margin-bottom: 3.21429px;
                position: relative;
                width: 0;
            }
            &.warn:before,
            &.warn:after {
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
            &.warn:before {
                transform: rotate(70deg);
            }
            &.warn:after {
                transform: rotate(-70deg);
            }

        }
        
    }
}
</style>
