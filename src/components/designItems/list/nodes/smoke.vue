<template>
    <div>
        <div ref="smoke" v-bind:class="[(state == 0)? 'normal' : 'warn','sensor']" draggable="true" @dragstart="dragStartFn" data-name="smoke">烟雾节点</div>
    </div>
</template>
<script>
export default {
    name: 'smoke',
    data(){
        return{
            state:0 //正常
        }
    },
    props:['dragStartFn']
}
</script>
<style lang="scss" scoped>
  .sensor{
        padding: 10px 20px;
        border-radius: 20px ;
        background: rgb(238, 203, 6);
  }
  
</style>
