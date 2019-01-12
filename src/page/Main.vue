<template>
<div>
  <div id="box" ref="mybox">
    <ws-tool v-bind:username="username"></ws-tool>
    <show-page v-bind:client-width="clientWidth" v-bind:client-height="clientHeight" v-bind:table-info="nodeInfo" v-bind:animat-info="nodeInfo"></show-page>
    <button @click="testaction">testaction</button><button @click="anothertestaction">testaction</button>
    <p>testaction当前的sss值是：{{testactionValue}}</p>
  </div>
    <!-- <my-table v-bind:info-sensor="nodeInfo"></my-table> -->
    
</div>
    
</template>

<script>
import Vue from 'vue'
import store from '../store'
import wsTool from '../components/showItems/wsTest'
import showPage from '../components/showItems/showPage'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'Main',
  data(){
    return {
      username: '',
      clientWidth:1200,
      clientHeight:600,
  	}
  	
  },
  created() {
    if(this.$route.params.usr !== undefined){
      this.username=this.$route.params.usr
      console.log('进入main函数中',this.username)
    }else{
      this.$router.push('/Login'); 
    }
    this.$nextTick(() => { //使用nextTick,保证dom元素都已经渲染完毕再获取元素
        this.clientWidth=document.getElementById("box").clientWidth
        this.clientHeight=document.getElementById("box").clientHeight
    });
    
  },
  components:{
    wsTool,
    showPage
  },
  computed:mapState({
    testactionValue:state=>state.dataTrans.testArr,
    nodeInfo:state=>state.dataTrans.nodeInfo,
  }),
  methods:{
    testaction(){
      this.$store.dispatch('dataTrans/testmyaction')
    },
    ...mapActions({
      anothertestaction:'dataTrans/testmyaction'
    }),
    changeFixed(height,width){ //动态修改样式
        this.$refs.mybox.style.height = height+'px';
        this.$refs.mybox.style.width = width+'px';
      },
  },
  mounted() {
    window.onresize = () => { 
          this.clientWidth=document.getElementById("box").clientWidth
          this.clientHeight=document.getElementById("box").clientHeight
          console.log('获取到的重载后的宽高',this.clientWidth,'\\',this.clientHeight)
      }
  },
}
</script>

<style>
#box{
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: #ccc;
}
</style>
