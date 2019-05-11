<template>
    <div class="icon" ref="icon" >
        <i v-if="fontSizeUp" @click="fontSizeUp">+</i>
        <i  v-if="fontSizeDown" @click="fontSizeDown">-</i>
        <i  v-if="save" @click="save">√</i>
        <i  v-if="remove" @click="remove">×</i>
        <i  v-if="edit" @click="edit">e</i>
    </div>
</template>
<script>
export default {
    name:"toolbar",
    data(){
        return{
            
        }
    },
    props:['fontSizeUp','fontSizeDown','remove','edit','save']

}
</script>


<style lang="scss" scoped>
.icon{
        height: 20px;
        width: 100%;
        background: #ccc;
        i{
            // display: inline-block;
            float: right;
            width: 20px;
            height: 20px;
            border: 1px solid #000;
            border-radius: 50% 50%;
            margin-left: 10px;
            text-align: center;
            line-height: 20px;
            font-size: 16px;
            &:hover{
                background: #1ABC9C;
                color: #fff;
                cursor: pointer;
            }
        }
    }
</style>

