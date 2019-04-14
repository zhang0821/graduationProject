<template>
<vue-draggable-resizable   drag-handle=".marquee_title" :resizable="design"  :draggable="design"  @dragstop="dragStop"
                 :x="detialInfo.left" :y="detialInfo.top" :w="styleDynamic.width" :h="styleDynamic.height" :minh="30" :minw="500"  >

     <div class="marquee">
        <div class="marquee_title" ref="queeHead">
            <span>报警消息</span>
        </div>
        <div class="marquee_box" v-resizable="{type:'warnBox',fn:resizeFn}">
            <ul class="marquee_list" :class="{marquee_top:animate}">
                <li v-for="(item, index) in marqueeList">
                    <span>{{item.floor_id}}楼{{item.room_id}}房间</span>
                    <span v-if="item.type == 'tem_hum'">温湿度传感器报警!当前温度：{{item.tempValue}},湿度：{{item.humiValue}}</span>
                    <span v-else-if="item.type == 'smoke'">烟雾传感器报警</span>
                    <span v-else-if="item.type == 'door'">门禁传感器报警</span>
                    <span v-else-if="item.type == 'water'">水浸传感器报警</span>
                    <span v-else-if="item.type == 'air'">气体传感器报警!当前氨气：{{item.nh4}},湿度：{{item.h2s}}</span>
                </li>
            </ul>
        </div>
        <!-- <div class="forDrag" v-resizable="{type:'warnBox',fn:resizeFn}">
        </div> -->
    </div>
</vue-draggable-resizable>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name:"warn-box",
    data(){
        return {
            animate: false,
            styleDynamic:null
        }
    },
    props:{
        detialInfo:{
            type:Object,
        },
        dragstopCb:{
            type:Function
        },
        design:{
            type:Boolean,
            required: true,
            default:false
        }
    },
    created() {
        this.styleDynamic=this.detialInfo
        console.log('报警框初始化的数据是：',this.detialInfo)
        setInterval(this.showMarquee, 5000)
    },
    computed:{
        ...mapState('dataTrans',{
            marqueeList:state=>state.warnInfo
        })
    },
    updated:function(){

    },
    // updated:{
    //     marqueeList:function(val){
    //         console.log('marqueeList值发生改变',val)
    //     }
    // },
    methods: {
        showMarquee(){
            if(this.marqueeList.length>0){
                this.animate = true;
                setTimeout(()=>{
                    
                        this.marqueeList.push(this.marqueeList[0]);
                    this.marqueeList.shift();
                    this.animate = false;
                },500)
            }
        },  
        dragStop(x,y){
            let newObj={
                left:x,
                top:y
            }
            let returnObj=Object.assign(this.detialInfo,newObj)
            this.dragstopCb(returnObj)
        },
        resizeFn(obj){
            // console.log('warnBox中的resizeFn被调用！！！,返回的宽高数据是',JSON.stringify(obj),'此时detial的宽高是',JSON.stringify(this.detialInfo))
            // this.styleDynamic.width=this.detialInfo.width+obj.w
            // this.styleDynamic.height=obj.h
            let newObj={
                width:obj.w,
                height:obj.h
                // width:this.styleDynamic.width,
                // height:this.styleDynamic.height
            }
            let returnObj=Object.assign(this.detialInfo,newObj)
            this.dragstopCb(returnObj)

        }
    }
}
</script>

<style lang="scss" scoped>
div, ul, li, span, img {
	margin: 0;
	padding: 0;
	display: flex;
	box-sizing: border-box;
}
.marquee {
	width: 100%;
	height: 100%;
	align-items: center;
	color: #fff;
	background-color: #8bb4c0;
	display: flex;
	box-sizing: border-box;
    .marquee_title {
	    padding: 0 20px;
        height: 80%;
        font-size: 20px;
        border-right: 1px solid #d8d8d8;
        align-items: center;
        color: red;
        &:hover{
            cursor: move;
        }
    }
    .forDrag{
        width: 10px;
        background: red;
        height: 100%;
    }
    .marquee_box {
        display: block;
        position: relative;
        flex: 1;
        height: 80%;
        overflow: hidden;
        .marquee_list {
            display: block;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
             li {
                height: 100%;
                font-size: 14px;
                padding-left: 20px;
                display: flex;
                background: #0e4252;
                align-items: center;
                span {
                    padding: 0 2px;
                }
            }
        }
    }
}
.marquee_top {
	transition: all 1s;
	margin-top: -100%;
}


</style>

