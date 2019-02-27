<template>
    <div>
        <div ref="tem_hum" :class="[draggingState,status === 0 ? 'warn' : (status === 1 ? 'normal' :'offLine')]" draggable="true" @dragstart="dragStartFn" data-name="door" comp-type="node"
             @click="clickFn" >
            <i v-if="draggingState == 'basicTpts'">门禁节点</i>
            <i v-else-if="data.dev_eui">{{data.dev_eui}}</i>
            <i v-else>door</i>
        </div>
    </div>
</template>
<script>
export default {
    name: 'temHum',
    data(){
        return{
            
        }
    },
    props:{
        dragStartFn:Function, //被拖拽后的回调
        draggingState:{
            type:String,
            default:'basicTpts' //作为左侧的模板还是设计框中的一个元素
        },
        data:{
            type: Object,
            // 对象或数组默认值必须从一个工厂函数获取
            default: function () {
                return { id: '0' ,tabIndex:'0'}
            }
        },
        status:{
            type:Number,
            default:1 //当处于左侧的模板时，还是offLine,warn,normal
        },
        clickFn:Function
    },
    methods:{
        clickFn(){
             this.$emit('child-click-event',this.data.tabIndex,this.data.id,'door')
        }
    }
    // props:["dragStartFn"]
}
</script>
<style lang="scss" scoped>
.basicTpts{
    color:#fff;
    padding: 10px 20px;
    border-radius: 20px;
    background:#8A5B47;
}
.itemNode{
    width:30px;height:30px;border-radius:50% 50%;
    background-color: blue;
    &.offLine{
        background-color: #999;
    }
    &.warn{
        background-color: red;
    }  
}
</style>
