<template>
     <div class="marquee">
        <div class="marquee_title">
            <span>最新战报</span>
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
    </div>
</template>

<script>
export default {
    data(){
        return {
            animate: false,
            marqueeList:[
                {
                    floor_id: '1',
                    room_id: '1-1',
                    type: 'tem_hum',
                    tempValue:88,
                    humiValue:80
                },
                {
                    floor_id: '1',
                    room_id: '1-1',
                    type: 'air',
                    nh4:88,
                    h2s:80
                },
                {
                    
                    floor_id: '1',
                    room_id: '1-1',
                    type: 'smoke',
                }
            ]
        }
    },
    created() {
        setInterval(this.showMarquee, 2000)
    },
    methods: {
        showMarquee: function () {
            this.animate = true;
            setTimeout(()=>{
                this.marqueeList.push(this.marqueeList[0]);
            this.marqueeList.shift();
            this.animate = false;
        },500)},
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
	color: #3A3A3A;
	background-color: #b3effe;
	display: flex;
	box-sizing: border-box;
}

.marquee_title {
	padding: 0 20px;
	height: 30px;
	font-size: 14px;
	border-right: 1px solid #d8d8d8;
	align-items: center;
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

