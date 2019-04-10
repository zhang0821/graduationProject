<template>
<vue-draggable-resizable   :resizable="design"  :draggable="design"  @dragstop="dragstopCb"
                 :x="detialInfo.left" :y="detialInfo.top" :w="500" :h="100" :minh="30" :minw="50" :parent="true" >
     <div>
       <input v-if="design" type="text" placeholder="键入文本">
       <div v-else class="text">
           {{detialInfo.text}}
       </div>
    </div>
</vue-draggable-resizable>
</template>
<script>
export default {
    data(){
        return {
        }
    },
    props:{
        detialInfo:{
            type:Object,
        },
        dragstopCb:{
            type:Function
        },
        design:{
            type:Boolean,
            default:false
        }
    },
}
</script>
<style lang="scss" scoped>
.dragtestBox{
    width:auto;
    position: absolute;
    border:1px solid #ccc;
    input{
        width: 100%;
        height: 100%;
        padding: 5px 10px;
    }
    .text{
        color: red;
        font-size: 20px;
        line-height: 100%;
    }
}
</style>

