<template>
    <div class="mainPage">
            <audio v-if="designStore.layoutInfo.fireMusic && myaudio!=null"  hidden :src="'/static/userUpload/'+usr+'/fireMusic.mp3'" ref="audioRef" controls="controls"  id="music"  loop="loop"   preload="auto">
            </audio>

           <div class="header" v-if="designStore.layoutInfo.layoutConTopHeight != 0" :style="{height: `${designStore.layoutInfo.layoutConTopHeight}px`}">
                显示上header
                <component v-for="(cmp,index) in Object.keys(designStore.layoutInfo)" :key="index"  v-if="typeof designStore.layoutInfo[cmp]=='object' && designStore.layoutInfo[cmp].position == 'top'" 
                            :is="designStore.layoutInfo[cmp].type" :detial-info="designStore.layoutInfo[cmp]" :design="false" :dragstop-cb="(obj)=>{}" >
                </component>
           </div>
       
            <div class="designCon">
                <div class="nodePosInfo">
                    <componets-con :operate-type="'show'"></componets-con>
                </div>
                <!-- <loading v-if="isLoging" marginTop="-30%"></loading> -->
            </div>

            <div class="header" v-if="designStore.layoutInfo.layoutConBottomHeight!=0" :style="{height: `${designStore.layoutInfo.layoutConBottomHeight}px`}">
                显示下header
                <component v-for="(cmp,index) in Object.keys(designStore.layoutInfo)" :key="index"  v-if="typeof designStore.layoutInfo[cmp]=='object' && designStore.layoutInfo[cmp].position == 'bottom'" 
                            :is="designStore.layoutInfo[cmp].type" :detial-info="designStore.layoutInfo[cmp]" :design="false" :dragstop-cb="(obj)=>{}" >
                </component>
            </div>

        


        <!-- 切换到组态设计入口 -->
        <div @click="goDesign" class="goDesign">design</div>

        <!-- 后端通信模块 -->
        <my-mqtt :username="usr"></my-mqtt>

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
                usr:null,
                isLoging:0,
                designStore:null
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
            this.$router.push({
                name:'Login'
            })
          }
          this.designStore=this.$route.params.info
          this.$store.commit('designStore/initSavedInfos',this.designStore)
        },
        computed:{
            ...mapState({
                myaudio:state=>state.dataTrans.audio,
            }),    
            
        },
        updated(){
            if(this.myaudio != null){
                this.$refs.audioRef.play()
            }
            console.log('main页面update,当前myaudio值',this.myaudio) //只要页面数据更新造成页面重新渲染，就会被调用
        },
        methods: {          
            ...mapActions({
            }),
            ...mapMutations({
                // bindAudioRefs:'dataTrans/audioRefs'
            }),
            goDesign(){
              this.$router.push({
                  name:'Design',
                  params:{
                      usr:this.usr
                  }
              })
            }
   
        },
        mounted(){//页面渲染完成后，才能获取refs绑定到的元素,只调用一次
            console.log('main页面mounted')
            if(this.designStore.layoutInfo.fireMusic && this.myaudio!=null){
                this.$refs.audioRef.play()
            }
        },
         watch:{
            usr:(newUsr)=>{
                console.log('主页面usr发生变化，src资源地质变化',newUsr)
            },
            // myaudio:(val,newVal)=>{
            //         console.log(val,'全局触发报警铃声',newVal)
            //     // console.log('全局触发报警铃声',newVal)
            //     // if(this.designStore.layoutInfo.fireMusic && newVal!=null){
            //     //     this.$refs.audioRef.play()
            //     //     // this.bindAudioRefs(this.$refs.audioRef)
            //     // }
            // }
        }
    }
</script>
<style lang="scss">
.mainPage{
    width: 100%;
    height: 100%;
    position: absolute;
    // background: #699;
    background-repeat: no-repeat;
    background-size: 100%;
    background-image: url('../assets/sky2.png');
    display: flex;
    flex-direction: column;
    audio{
        height: 0;
    }
    .header{
        width: 100%;
        // height: 100px;
        // background: #000;
        // .title{
        //     text-align: center;
        //     line-height: 100px;color: #fff;padding: 0 10px;
        //     // margin-left:auto;margin-right: auto;
        // }
    }
    .designCon{
        flex:1;
        width: 100%;
        // background:rgb(139 , 180, 192);
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
        // background: #ccc;
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
  color: #fff;
  &:hover{
    cursor: pointer;
    left: calc(100%-80px);
    top:0;
    // transform: translateX(-100%);
  }
}
</style>