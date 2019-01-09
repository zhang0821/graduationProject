<template>
    <div>
        <div class="sensor">{{tem}}<br>{{hum}}</div>
    </div>
</template>
<script>
export default {
    name: 'temHum',
    data(){
        return{
            tem:0,
            hum:0,
        }
    }
}
</script>
<style lang="scss" scoped>
.sensor{
    width: 50px;
    height: 30px;
    border-radius: 20px;
    background: rgb(36, 138, 179);
}
</style>
