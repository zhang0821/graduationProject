<template>
    <div class="room-set-box">
         <!-- 温湿度节点需配置的信息 -->
        <li  v-if="nodeType == 'tem_hum'">
            <input type="textbox" v-model="info.temMax"  placeholder="最高温度阈值">
            <input type="textbox" v-model="info.temMin"   placeholder="最低温度阈值">
        </li>
        
        <li  v-if="nodeType == 'tem_hum'">
            <input type="textbox" v-model="info.humiMax" placeholder="最高湿度阈值">
            <input type="textbox" v-model="info.humiMin" placeholder="最低湿度阈值">
        </li>
        <!-- end -->

        <!-- 气体节点需配置的信息 -->
        <li  v-if="nodeType == 'air'">
            <input type="textbox" v-model="info.h2sMax"  placeholder="硫化氢浓度阈值">
            <input type="textbox" v-model="info.nh4Max"   placeholder="氨气浓度阈值">
        </li>
        <!-- end -->

        <!-- 烟雾信息 -->
        <li  v-if="nodeType == 'smoke'">
            <file-upload :file-type="'mp3'"></file-upload>
        </li>
        <!-- end -->
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    props:['registedInfosObj']
}
</script>



