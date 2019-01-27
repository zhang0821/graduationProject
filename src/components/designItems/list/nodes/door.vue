<template>
    <div>
        <div ref="tem_hum" class="sensor" draggable="true" @dragstart="dragStartFn" data-name="door" comp-type="node">门禁节点</div>
    </div>
</template>
<script>
export default {
    name: 'temHum',
    data(){
        return{
            
        }
    },
    props:["dragStartFn"]
}
</script>
<style lang="scss" scoped>
.sensor{
    color:#fff;
    padding: 10px 20px;
    border-radius: 20px;
    background:#8A5B47;
}
</style>
