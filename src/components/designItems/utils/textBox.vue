<template>
     <div class="dragtestBox"  v-resizable >
       <input type="text" placeholder="键入文本">
    </div>
</template>
<script>
export default {
    
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
}
</style>

