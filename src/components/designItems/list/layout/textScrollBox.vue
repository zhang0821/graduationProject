<template>
     <div class="marquee" @contextmenu.prevent="showMenu('1')">
        <div class="marquee_title">
            <span>报警消息</span>
        </div>
        <div class="marquee_box">
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
          <!-- 节点右键菜单弹出 -->
                            <vue-context-menu :contextMenuData="contextMenuData"
                            :transferIndex="transferIndex"
                            @delete="deleteItem('warnBox')"
                            @modify="modifyItem"></vue-context-menu>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
    data(){
        return {
            animate: false,

            transferIndex: null, // Show the menu that was clicked
            contextMenuData: {
                menuName: 'demo',
                axis: {
                    x: null,
                    y: null
                },
                menulists: [
                    {
                    fnHandler: 'delete',
                    icoName: 'fa fa-fw',
                    btnName: '移除'
                    }
                ]
            }
        }
    },
    created() {
        setInterval(this.showMarquee, 5000)
    },
    computed:{
        ...mapState('dataTrans',{
            marqueeList:state=>state.warnInfo
        }),
        ...mapMutations({
            deleteItem:'designStore/deleteItem'
        })
    },
    updated:{
        marqueeList:(val)=>{
            console.log('marqueeList值发生改变',val)
        }
    },
    methods: {
        showMarquee: function () {
            this.animate = true;
            setTimeout(()=>{
                this.marqueeList.push(this.marqueeList[0]);
            this.marqueeList.shift();
            this.animate = false;
        },500)},

         /**右键菜单 */
        showMenu (index) {
            this.transferIndex = index // tranfer index to child component
            event.preventDefault()
            var x = event.clientX
            var y = event.clientY
            this.contextMenuData.axis = {
            x, y
            }
        },
        modifyItem () {
            console.log('修改样式')
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
	height: 50px;
	align-items: center;
	color: #fff;
	background-color: #8bb4c0;
	display: flex;
	box-sizing: border-box;
}

.marquee_title {
	padding: 0 20px;
	height: 30px;
	font-size: 20px;
	border-right: 1px solid #d8d8d8;
	align-items: center;
    color: red;
}

.marquee_box {
	display: block;
	position: relative;
	width: 60%;
	height: 30px;
	overflow: hidden;
}

.marquee_list {
	display: block;
	position: absolute;
	top: 0;
	left: 0;
}
.marquee_top {
	transition: all 0.5s;
	margin-top: -30px
}

.marquee_list li {
	height: 30px;
	line-height: 30px;
	font-size: 14px;
	padding-left: 20px;
}

.marquee_list li span {
	padding: 0 2px;
}


</style>

