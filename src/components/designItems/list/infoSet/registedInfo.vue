<template>
    <div class="show-registed" v-if="Object.keys(registedInfosObj).length">
        <h4>已注册楼层&房间信息</h4>
        <ul >
            <li v-for="room in Object.keys(registedInfosObj)">
                <button>{{registedInfosObj[room]}}</button>
            </li>
        </ul>

        <div class="btn-save" @click="save">保存配置</div>
    </div>
</template>
<script>
export default {
    name:"nodeInfoSet",
    data(){
        return{
            info:{
                
            }
        }
    },
    props:['registedInfosObj'],
    components:{
    },
    mapState:{

    },
    methods:{
        save(){
           
        }
    }

}
</script>
<style lang="scss" scoped>
.show-registed{
    text-align: center;
    margin-top: 10px;
    border-top: 1px solid #fff;
    width: 100%;
    color:#fff;
}
</style>