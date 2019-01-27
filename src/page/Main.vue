<template>
    <div class="mainPage">
           
        <div class="header">
    
            <div class="title">
                <h1>{{designStore.layoutInfo.title}}</h1>
                <h4>{{designStore.layoutInfo.subtitle}}</h4>
            </div>
        	<audio v-if="designStore.layoutInfo.fireMusic" :src="'/static/userUpload/'+usr+'/fireMusic.mp3'" controls="controls"  id="music"  loop="loop" hidden="hidden"  preload="auto">
            </audio>
        </div>
        <div class="designCon">
            <div class="nodePosInfo">
                <componets-con :operate-type="'show'"></componets-con>
            </div>
            <!-- <loading v-if="isLoging" marginTop="-30%"></loading> -->
        </div>
          
        <div class="warnScroll">
            <text-scroll-box></text-scroll-box>

        </div>
      <div @click="goDesign" class="goDesign">design</div>
      <final-mqtt :username="usr"></final-mqtt>
    </div>
</template>
<script>
import componetsCon from '../components/designItems/itemsContainer'
import loading from '../components/showItems/Loading'
import utils from '../components/designItems/utils'
import mainShow from "../components/showItems";
import { mapState, mapActions, mapMutations } from 'vuex';

    export default {
        name: 'Design',
        data() {
            return {
                usr:this.$store.state.dataTrans.username,
                isLoging:0,
            }
        },
        components:{
            componetsCon,
            loading,
            ...utils,
            ...mainShow
        },
        created() {
          if(this.$route.params.usr){
            this.usr=this.$route.params.usr
          }else{
            this.usr=this.$store.state.dataTrans.username
          }
        },
        computed:{
            ...mapState({
                designStore:state=>state.designStore,
            }),    
            
        },
        methods: {          
            ...mapActions({
            }),
            ...mapMutations({
                
            }),
            goDesign(){
              this.$router.push({
                  name:'Design',
                  params:{
                      usr:this.$store.state.dataTrans.username
                  }
              })
            }
   
        },
    }
</script>
<style lang="scss">
.mainPage{
    width: 100%;
    height: 100%;
    position: absolute;
    background: #699;
    display: flex;
    flex-direction: column;
    .header{
        width: 100%;
        height: 100px;
        background: #000;
        .title{
            text-align: center;
            line-height: 100px;color: #fff;padding: 0 10px;
            // margin-left:auto;margin-right: auto;
        }
    }
    .designCon{
        flex:1;
        width: 100%;
        background:rgb(139 , 180, 192);
        display: flex;
        flex-direction: column;
        .nodePosInfo{
            width: 100%;
            flex: 1;
            // height: 100%;
        }
    }
    .warnScroll{
        width: 100%;
        height: 50px;
        background: #ccc;
    }
        
    
}
.goDesign{
  position: absolute;
  width: 80px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-radius: 20px;
  top:-30px;
  left:  calc(100%-40px);
//   transform: translateX(-50%);
  background: #fff;
  &:hover{
    cursor: pointer;
    left: calc(100%-80px);
    top:0;
    // transform: translateX(-100%);
  }
}
</style>