
<template>
<div>
    <ul class="floorTabs">
        <li v-for="(item,index) in tabs" :class="{active:index == curTab}" @click="tab(index)">{{item}}</li>
    </ul>
    <div id="tabCon" @dblclick="addNode">
        <div v-if="0 == curTab" class="tab">
            tab1  节点展示  区域1               
        </div>

<!-- 节点展示 -->
        <div v-if="1 == curTab"  class="tab"> 
            <animt-demo :infos="animatInfo" :sensor-container-width="clientWidth" :sensor-container-height="clientHeight"></animt-demo>
        </div>
<!-- 表格展示 -->
        <div v-if="2 == curTab" class="tab">   
           <!-- <my-table v-bind:info-sensor="tableInfo" ></my-table>   -->
           列表展示
        </div>
<node-regist v-bind:pos="clickPos" v-if="registBox" v-on:child-cancle="listenChildRegist" v-on:postregist="postregist"></node-regist>
    
    </div>
        
</div>
    
</template>
<script>
import Vue from 'vue'
import store from '../store'
import myTable from './tableShow'
import animtDemo from './animtDemo'
import nodeRegist from './nodeRegist'

export default {
    name:'showPage',
    data(){
        return{

            tabs: ["区域1", "区域2","列表展示"],//tab页面相关
            tabCons: ["内容一", '内容组件2',"内容三",'这是表格'],
            curTab:0,


            clickPos:{
                x:10,
                y:0,
                showx:0,
                showy:0
            },
            registBox:false,
        }
    },
    props:["clientWidth","clientHeight","tableInfo","animatInfo"],
    components:{
        nodeRegist,
        myTable,
        animtDemo

    },
    methods:{
        /**新增节点 */
        addNode(e){
            if(this.curTab==1){
                console.log("横坐标",e.pageX,"this.clientWidth:",this.clientWidth,'纵坐标：',e.pageY,"this.clientHeight",this.clientHeight)
                this.clickPos.showx= e.clientX
                this.clickPos.showy= e.clientY            
                this.clickPos.x=Math.floor(e.pageX/this.clientWidth*100)/100
                this.clickPos.y=Math.floor(e.pageY/this.clientHeight*100)/100
                this.registBox=true
            }
        },
        tab(index){
            this.curTab=index
            console.log("当前curTab是",index)
        },
        /**
         * 子组件的回调函数的执行
         */
        listenChildRegist(msg){
            this.registBox=msg
        },
    },
    created() {
        console.log('获取到的父组件传递进入的参数有',this.clientWidth,'高',this.clientHeight,'数据',this.tableInfo,"animatInfo数据是",this.animatInfo)
    },
    mounted() {
        
    },
    destroyed() {
        
    },
}
</script>
<style scoped>
.floorTabs{
    width: 100%;
    height: 40px;
    background: #999;
           
}
#tabCon{
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 500px;
    background:#699;
}
#tabCon .tab{
    width: 100%;
    height: 100%;
}
.floorTabs{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50px;
    background: #999;
}
li{
    flex: 1;
    border: 1px solid #fff;
    list-style: none;
    text-align: center;
}
</style>
    
    
      