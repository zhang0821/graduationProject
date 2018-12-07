<template>
<div>
    <div>我是主页内容</div>
    <clock></clock>
    <p>下面是ws测试</p>
    <ws-tool v-bind:username="username"></ws-tool>
</div>
    
</template>

<script>

import wsTool from '../components/wsTest'
import clock from '../components/myClock'
export default {
  name: 'Maib',
  data(){
    return {
  		username: ''
  	}
  	
  },
  created() {
    if(this.$route.params.usr !== undefined){
      this.username=this.$route.params.usr
      console.log('进入main函数中',this.username)
    }else{
      this.$router.push('/Login'); 
    }
    
  },
  components:{
    wsTool,
    clock
  },
  methods:{

  	
  }
}
</script>

<style>
div{
    color:red;
}
</style>
