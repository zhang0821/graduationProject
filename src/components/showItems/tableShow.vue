<template>
    <table  >
        <caption >
            监控房间实时信息汇总表
        </caption>
        <tr style="width:100%;height:30px;">
            <th>区域</th>
            <th>房间编号</th>
            <th>平均温度(℃)</th>
            <th>平均湿度(%Rh)</th>
            <th>烟雾报警器状态</th>
            <th>水浸传感器状态</th>
            <th>门禁传感器状态</th>
        </tr>
        <!-- <tbody v-for="(room,index) in infoSensor" :key="index" :value=""> -->
        <tbody>
            <tr v-for='room in infoSensor'>
                <td>{{room.floor_name}}</td>
                <td>{{room.room_id}}</td>             
                <td v-bind:class="[{offLine:(room.temp_value)== null}]">
                    <template v-if="(room.temp_value)== null">
                        离线
                    </template>
                    <template v-else>
                        {{room.temp_value}}
                    </template>
                </td>
                <td v-bind:class="[{offLine:(room.humi_value)== null}]">
                    <template v-if="(room.humi_value)== null">
                        离线
                    </template>
                    <template v-else>
                        {{room.humi_value}}
                    </template>
                </td>
                <td v-bind:class="(room.smoke=='离线' ? 'offLine':(room.smoke=='异常' ? 'warn':'normal'))">
                    <template v-if="(room.smoke != null)">
                        {{room.smoke}}
                    </template>
                    <template v-else>
                       --
                    </template>
                </td>
                <td v-bind:class="(room.water=='离线' ? 'offLine':(room.water=='异常' ? 'warn':'normal'))">
                    <template v-if="(room.water != null)">
                        {{room.water}}
                    </template>
                    <template v-else>
                       --
                    </template>
                </td>
                <td v-bind:class="(room.door=='离线' ? 'offLine':(room.door=='异常' ? 'warn':'normal'))">
                    <template v-if="(room.door != null)">
                        {{room.door}}
                    </template>
                    <template v-else>
                       --
                    </template>
                </td>
                           
            </tr>
        </tbody>						
        </table>
</template>
<script>
export default {
  name: 'tableShow',
  data () {
    return { 

     }
  },
  props:['infoSensor'],
  created () {
    console.log('table组件被调用')
  },
  destroyed () {
  },
}
</script>

<style scoped>
table{
    width: 100%;
    max-height: 500px;
    font-family: '微软雅黑';
    text-align: center;
    color: #fff;
    background: #699;
    border-collapse: collapse;
    border: 1px solid #000;
}
tbody{
    overflow-y: auto;
}
tr th{
    padding: 30px 10px;
    font-size: 20px;
    font-weight: bold;
    
}
tr td{
    padding: 20px 10px;
    font-size: 18px;
    
}
th,td{
    border: 1px solid #ccc;
}
caption{
    font-size: 20px;border-bottom: 1px solid #fff;
}
.offLine{
    background: #999;
}
.warn{
    background: red;
}
</style>
