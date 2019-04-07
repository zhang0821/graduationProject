<template>
    <div class="drawBoard" ref="drawBoard"> 
        <!-- 全屏画布 -->
        <canvas id="canvas" ref="canvas"></canvas>
        <!-- 功能菜单 -->
        <ul id="menu" ref="menu">
            <li @click="">
                <span class="glyphicon glyphicon-pencil"> </span>
            </li>
            <li>
                <span class="glyphicon glyphicon-italic"></span>
            </li>
            <li>
                <span></span>
            </li>
            <li>
                <span></span>
            </li>
            <li>
                <span class="glyphicon glyphicon-cog"></span>
            </li>
            <li>
                <span class="glyphicon glyphicon-asterisk"></span>
            </li>
            <li>
                <span class="glyphicon glyphicon-erase"></span>
            </li>
            <li>
                <span class="glyphicon glyphicon-repeat"></span>
            </li>
            <li>
                <span class="glyphicon glyphicon-download"></span>
            </li>		
        </ul>

        <!-- 颜色画笔选择侧边栏 -->
        <div id="sidebar" ref="sidebar">
            <div class="sidebar-draw" ref="sidebarDraw">
                <!-- <h2>画笔</h2> -->
                <ul>
                    <li>
                        <span></span>
                    </li>
                    <li>
                        <span></span>
                    </li>
                    <li>
                        <span></span>
                    </li>
                    <li>
                        <span></span>
                    </li>
                    <li>
                        <span></span>
                    </li>
                    <li>
                        <span></span>
                    </li>			
                </ul>
            </div>
            <div class="sidebar-color" ref="sidebarColor">
                <!-- <h2>颜色</h2> -->
                <ul>
                    <li></li>
                    <li></li>				
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
        <!-- 开屏动画 -->
        <div id="firstScreen" ref="firstScreen" class="first-screen">
            <span>
                <img src="../../assets/drawLogo.gif" />
            </span>
        </div>
        <!-- 弹窗提示框 -->
        <div id="tip" class="tip" ref="tip">
            <div class="tip-main">
                <span ref="tip0"></span>
                <span class="text" ref="tip1">你选择了红色！</span>
            </div>
        </div>
        <!-- 鼠标右键菜单 -->
        <div id="contextmenu" class="contextmenu" ref="contextmenu">
            <ul>
                <li>Canvas画板 v3.20</li>
                <li @click="fullScreen">全屏模式</li>
                <li @click="saveImg">
                    <a>
                        保存绘画
                        <img src="" id="saveImg"/>
                    </a>
                </li>
            </ul>
        </div>
        <!-- 动态添加A标签用于下载 -->
           <a ref="aElement" class="downAlable">hidden </a>
    </div>
	
</template>
<script>
import { setTimeout, setInterval, clearInterval } from 'timers';
export default {
    name: 'drawBorad',
    data(){
        return{
                W: null,
                H: null,
                CTX: null,
                DATA: [],	//储存绘制数据
                COLOR: '#f00056',
                LINE: 5,
                PENS: 0,
                ERAS: 0,
                TIMER: null,
                downObj:null
        }
    },
    created(){
       
    },
    mounted(){
         //2s后隐藏开屏界面，初始化画板
        let firstScreen = this.$refs.firstScreen //要在元素渲染完成后才能取到
        this.W=this.$refs.drawBoard.clientWidth
        this.H=this.$refs.drawBoard.clientHeight
        setTimeout(() =>{
            this.init();
            firstScreen.style.display = 'none';
        },3000);
    },
    methods:{
        init(){
             //显示画板
            this.showBoard();
            //默认画笔功能
            this.drawPen();
            //菜单功能选择
            this.menuOption();
            //颜色选择
            this.selectColor();
            //粗细选择
            this.selectLine();
            //自定义菜单
            this.customMenu();
        },
        //菜单功能选择
        menuOption () {

            var menu = this.$refs.menu

            var item = menu.getElementsByTagName('li');

            var btn = item[8].getElementsByTagName('span')[0];

            // var bar = document.getElementById('sidebar');
            var bar = this.$refs.sidebar

            var barDraw = this.$refs.sidebarDraw
            var barColor = this.$refs.sidebarColor
            var showOff = true;

            //画笔工具
            item[0].onclick = () =>{
                bar.style.display = 'none';
            this.showTip('你选择了画笔工具！');
            this.drawPen();
            };
            //直线工具
            item[1].onclick = () => {
                bar.style.display = 'none';

            this.showTip('你选择了直线工具！');
            this.drawLine();
            };
            //圆形工具
            item[2].onclick = () => {
                bar.style.display = 'none';

            this.showTip('你选择了圆形工具！');
            this.drawCircle();
            };
            //矩形工具
            item[3].onclick = () => {
                bar.style.display = 'none';

            this.showTip('你选择了矩形工具！');
            this.drawRect();
            };
            //粗细工具
            item[4].onclick = () => {

            barColor.style.display = 'none';
            barDraw.style.display = 'block';
            bar.style.right = 0;
            bar.style.display = 'block';
            };
            //颜色工具
            item[5].onclick = () => {

            barColor.style.display = 'block';
            barDraw.style.display = 'none';
            bar.style.right = 0;
            bar.style.display = 'block';
            };
            //橡皮擦工具
            item[6].onclick = () =>{
                bar.style.display = 'none';

            this.showTip('你选择了橡皮擦！');
            this.eraser();
            };
            //撤退功能 
            item[7].onclick = () => {

            if (this.toBack()) {

                this.showTip('撤退成功！');
            } else {

                this.showTip('撤退无效！你没有绘画！', 'remove');
            }
            };
            //隐藏与显示工具栏
            item[8].onclick = () => {

            menu.style.top = '-400px';
            showOff = false;
            btn.className = 'glyphicon glyphicon-download';
            };
            item[8].onmouseover = () => {

            if (showOff) return;
            showOff = true;

            menu.style.top = '0';
            btn.className = 'glyphicon glyphicon-upload';
            };
        },
        //显示画板
        showBoard() {

            let menu = this.$refs.menu
            let btn = menu.getElementsByTagName('span')[8];

            let canvas=this.$refs.canvas
            this.CTX = canvas.getContext('2d');

            canvas.style.display = 'block';
            canvas.width = this.W;
            canvas.height = this.H;

            menu.style.display = 'block';

            //取消菜单上的冒泡
            menu.onmousedown =  (ev)=> {
                ev = ev || event;
                ev.cancelBubble = true;
            };
            //菜单滑出
            setTimeout(()=>{
                menu.style.top = '0';
                btn.className = 'glyphicon glyphicon-upload';
                this.showTip('欢迎使用画板！鼠标绘画哟～');
            }, 500);
        },

        //画笔功能
        drawPen() {

            document.onmousedown =  (ev) =>{
            ev = ev || event;
            let sx = ev.clientX -this.$refs.drawBoard.getBoundingClientRect().left;
            let sy = ev.clientY -this.$refs.drawBoard.getBoundingClientRect().top;
            this.PENS++;
            //画笔性能优化 每36ms取一个点
            let onOff = true;

            document.onmousemove =  (ev) =>{

                if (!onOff) return;
                    onOff = false;
                setTimeout(()=> {
                    onOff = true;
                }, 36);
                ev = ev || event;
                let ex = ev.clientX-this.$refs.drawBoard.getBoundingClientRect().left;
                let ey = ev.clientY -this.$refs.drawBoard.getBoundingClientRect().top;
                let n = this.DATA.length;
                this.DATA[n] = new Object();
                //为画笔绘制的对象定义属性'point-line'
                //将该对象存入绘制数据中
                this.DATA[n].attr = 'point-line';
                this.DATA[n].count = this.PENS;
                this.DATA[n].sx = sx;
                this.DATA[n].sy = sy;
                this.DATA[n].ex = ex;
                this.DATA[n].ey = ey;
                this.DATA[n].w = this.LINE;
                this.DATA[n].c = this.COLOR;
                //直接绘制
                this.CTX.beginPath();
                this.CTX.moveTo(sx, sy);
                this.CTX.lineTo(ex, ey);
                this.CTX.closePath();
                this.CTX.strokeStyle = this.COLOR;
                this.CTX.lineJoin = 'round';
                this.CTX.lineCap = 'round';
                this.CTX.lineWidth = this.LINE;
                this.CTX.stroke();
                sx = ex;
                sy = ey;
            };

            document.onmouseup =  ()=> {
                document.onmousemove = '';
            };

            return false;
            };
        },

        //直线绘制
        drawLine() {
            document.onmousedown =  (ev)=> {

            ev = ev || event;
            var sx = ev.clientX -this.$refs.drawBoard.getBoundingClientRect().left;
            var sy = ev.clientY-this.$refs.drawBoard.getBoundingClientRect().top;
            var n = this.DATA.length;

            document.onmousemove =  (ev) =>{

                ev = ev || event;
                var ex = ev.clientX-this.$refs.drawBoard.getBoundingClientRect().left;
                var ey = ev.clientY-this.$refs.drawBoard.getBoundingClientRect().top;

                this.DATA[n] = new Object();
                this.DATA[n].attr = 'line';
                this.DATA[n].sx = sx;
                this.DATA[n].sy = sy;
                this.DATA[n].ex = ex;
                this.DATA[n].ey = ey;
                this.DATA[n].w = this.LINE;
                this.DATA[n].c = this.COLOR;

                //直线绘制时、时时渲染
                this.render();
            }

            document.onmouseup =  ()=> {

                document.onmousemove = '';
            };
            return false;
            };
        },

        //圆形绘制
        drawCircle () {

            document.onmousedown =  (ev) => {

            ev = ev || event;
            var sx = ev.clientX-this.$refs.drawBoard.getBoundingClientRect().left;
            var sy = ev.clientY-this.$refs.drawBoard.getBoundingClientRect().top;
            var n = this.DATA.length;

            document.onmousemove = (ev)=> {

                ev = ev || event;
                var ex = ev.clientX-this.$refs.drawBoard.getBoundingClientRect().left;
                var ey = ev.clientY-this.$refs.drawBoard.getBoundingClientRect().top;

                var cx = ex - sx;
                var cy = ey - sy;

                var R = Math.sqrt(cx * cx + cy * cy) / 2;

                this.DATA[n] = new Object();
                this.DATA[n].attr = 'circle';
                this.DATA[n].x = cx / 2 + sx;
                this.DATA[n].y = cy / 2 + sy;
                this.DATA[n].r = R;
                this.DATA[n].c = this.COLOR;

                this.render();
            };

            document.onmouseup =  () =>{
                document.onmousemove = '';
            };
            return false;
            };
        },

        //矩形绘制
        drawRect () {

            document.onmousedown =  (ev) =>{

            ev = ev || event;
            var sx = ev.clientX;
            var sy = ev.clientY;
            var n = this.DATA.length;

            document.onmousemove =  (ev) => {

                ev = ev || event;
                var ex = ev.clientX;
                var ey = ev.clientY;

                var cx = ex - sx;
                var cy = ey - sy;

                this.DATA[n] = new Object();
                this.DATA[n].attr = 'rect';
                this.DATA[n].x = sx;
                this.DATA[n].y = sy;
                this.DATA[n].w = cx;
                this.DATA[n].h = cy;
                this.DATA[n].c = this.COLOR;

                this.render();
            };

            document.onmouseup =  () =>{

                document.onmousemove = '';
            };

            return false;
            };
        },

        //橡皮擦功能
        eraser () {

            document.onmousedown =  ()=> {

            this.ERAS++;
            document.onmousemove =  (ev) =>{

                ev = ev || event;
                var ex = ev.clientX;
                var ey = ev.clientY;
                var n = this.DATA.length;

                this.DATA[n] = new Object();
                //为橡皮擦绘制的方块定义属性 'clear-rect'
                this.DATA[n].attr = 'clear-rect';
                this.DATA[n].count = this.ERAS;
                this.DATA[n].x = ex - 15;
                this.DATA[n].y = ey - 15;
                //橡皮擦固定宽高
                this.DATA[n].w = 30;
                this.DATA[n].h = 30;
                this.DATA[n].c = '#fff';
                this.CTX.fillStyle = '#fff';
                this.CTX.beginPath();
                this.CTX.fillRect(ex - 15, ey - 15, 30, 30);
                this.CTX.closePath();
                this.CTX.fill();

            };
            document.onmouseup =  () =>{

                document.onmousemove = '';
            };

            return false;
            };
        },

        //渲染图像
        render() {

            //清空画布
            this.CTX.clearRect(0, 0, this.W, this.H);

            for (let i = 0; i < this.DATA.length; i++) {

            switch (this.DATA[i].attr) {

                //橡皮擦、矩形按下列规则绘制
                case 'clear-rect':
                case 'rect':

                this.CTX.fillStyle = this.DATA[i].c;
                this.CTX.beginPath();
                this.CTX.fillRect(this.DATA[i].x, this.DATA[i].y, this.DATA[i].w, this.DATA[i].h);
                this.CTX.closePath();
                this.CTX.fill();
                break;

                case 'circle':

                this.CTX.beginPath();
                this.CTX.arc(this.DATA[i].x, this.DATA[i].y, this.DATA[i].r, 0, 2 * Math.PI, false);
                this.CTX.closePath();
                this.CTX.fillStyle = this.DATA[i].c;
                this.CTX.fill();
                break;

                //画笔、直线按下列规则绘制
                case 'point-line':
                case 'line':

                this.CTX.beginPath();
                this.CTX.moveTo(this.DATA[i].sx, this.DATA[i].sy);
                this.CTX.lineTo(this.DATA[i].ex, this.DATA[i].ey);
                this.CTX.closePath();
                this.CTX.lineJoin = 'round';
                this.CTX.lineCap = 'round';
                this.CTX.strokeStyle = this.DATA[i].c;
                this.CTX.lineWidth = this.DATA[i].w;
                this.CTX.stroke();
                break;
            }
            }
        },
        //撤退功能 根据最后一次绘画数据属性来判断 撤退的步数
        toBack () {

            var lastData = this.DATA[this.DATA.length - 1];

            if (!lastData) {

            this.showTip('撤退无效！你没有绘画！', 'remove');
            return false;
            }

            var attr = lastData.attr;

            switch (attr) {

            case 'line':
            case 'circle':
            case 'rect':

                this.DATA.pop();
                break;

            case 'point-line':
            case 'clear-rect':

                var count = this.DATA[this.DATA.length - 1].count;
                for (var i = this.DATA.length - 1; i >= 0; i--) {

                //撤退画笔功能及橡皮擦功能 满足属性值及下笔的次数
                if (attr == this.DATA[i].attr && count == this.DATA[i].count) {

                    this.DATA.pop();
                } else {

                    break;
                }
                }
                break;
            }
            this.render();
            return true;
        },
        //消息框 i参数为图标参数 不填默认ok（勾图标） 填remove（叉图标）
        showTip (t, i) {

            // var tip = document.getElementById('tip');
            let tip=this.$refs.tip

            // var icon = tip.getElementsByTagName('span')[0]
            let icon =this.$refs.tip0

            let text =this.$refs.tip1

            clearInterval(this.TIMER);

            i = i || 'ok';
            icon.className = 'glyphicon glyphicon-' + i;
            text.innerHTML = t;
            tip.style.display = 'block';
            tip.style.transition = '0.5s';
            setTimeout( () =>{

            tip.style.top = '50px';
            }, 16);
            this.TIMER = setTimeout(function () {

            tip.style.transition = '';
            tip.style.display = 'none';
            tip.style.top = '0';
            }, 500);
        },
        //自定义右键菜单
        customMenu () {

            let menu=this.$refs.contextmenu
            var timer = null;
            document.oncontextmenu =  (ev) =>{

            clearTimeout(timer);

            ev = ev || event;
            var sX = ev.clientX;
            var sY = ev.clientY;

            menu.style.display = 'block';
            menu.style.left = sX + 'px';
            menu.style.top = sY + 'px';

            timer = setTimeout( () =>{

                menu.style.display = 'none';
            }, 3000);

            return false;
            };

            menu.onclick = function () {

            clearTimeout(timer);
            this.style.display = 'none';
            };
        },

        //全屏模式
        fullScreen () {

            var docElm = document.documentElement;

            if (docElm.requestFullscreen) {

            docElm.requestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {

            docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {

            docElm.webkitRequestFullScreen();
            }
            else if (elem.msRequestFullscreen) {

            elem.msRequestFullscreen();
            }
        },
        //图片保存
        saveImg () {

            let canvas =this.$refs.canvas
            let MIME_TYPE = 'image/png'
            let imgURL = canvas.toDataURL(MIME_TYPE)
            let aElement = this.$refs.aElement
            
            aElement.download = 'yourpicture' //图片保存名字
            aElement.href = imgURL
            aElement.dataset.downloadurl = [MIME_TYPE, aElement.download, aElement.href].join(':')
            aElement.click()
        },
          //选择线条粗细
        selectLine () {

            var bar = this.$refs.sidebar
            bar.style.display='block'
            let sidebarDraw = this.$refs.sidebarDraw
            let barDrawLi = sidebarDraw.getElementsByTagName('li');
            // var barDrawLi = document.querySelectorAll('.sidebar-draw li');

            //var btn = item[8].getElementsByTagName('span')[0];

            var arrLine = [3, 6, 9, 12, 15, 20];

            //取消冒泡
            bar.onmousedown = function (ev) {
                ev = ev || event;
                ev.cancelBubble = true;
            };
            for (let i = 0; i < barDrawLi.length; i++) {

                barDrawLi[i].index = i;
                barDrawLi[i].onclick = (e) => {
                    this.showTip('你重新选择了画笔宽度！')
                    this.LINE = arrLine[i];
                    // bar.style.right = '-'+this.W+'px';
                    // bar.style.left = this.$refs.drawBoard.getBoundingClientRect().left+this.$refs.drawBoard.clientWidth+'px'
                    bar.style.right = this.$refs.sidebar.clientWidth+'px'
                    bar.style.display='none'

                };
            }
        },

        //选择颜色
        selectColor () {

            let bar=this.$refs.sidebar
            bar.style.display='block'
            let sidebarColor = this.$refs.sidebarColor
            let barColorLi = sidebarColor.getElementsByTagName('li');

            let arrColor = ['#f00056', '#fff', '#faff72', '#44cef6', '#00bc12', '#ffa400', '#000'];
            //取消冒泡
            bar.onmousedown =  (ev) => {
                ev = ev || event;
                ev.cancelBubble = true;
            };
            for (let i = 0; i < barColorLi.length; i++) {

                barColorLi[i].index = i;
                barColorLi[i].style.background = arrColor[i];

                barColorLi[i].onclick =  () => {

                    this.showTip('你重新选择了颜色！');
                    this.COLOR = arrColor[i];
                    bar.style.right = this.$refs.sidebar.clientWidth+'px'
                    // bar.style.left = this.$refs.drawBoard.getBoundingClientRect().left+this.$refs.drawBoard.clientWidth+'px'
                    bar.style.display='none'

                };
            }
        },

 

  
    }
    
}
</script>

<style lang="scss" scoped>
.downAlable{
    position: absolute;
    visibility: hidden;
}
.drawBoard{
    width: 500px;
    height:300px;
    border: 2px solid #16A085;
    background: #fff;
    position: absolute;
    // z-index: 4;
    top:0;
    left: 50px;
    // transform: translate(-50%,-50%);
    // top:50%;
    // left: 50%;
    // transform: translate(-50%,-50%);
}
li{
	list-style: none;
}
#canvas{
	display: none;
}
#menu{
	position: absolute;
	z-index:3;
	background:#000;
	left: 0;
    transform: translateX(-100%);
	// top: -400px;
	// display:none;
	transition: 0.5s ease-out;
}
#menu li{
	width: 50px;
	height: 50px;	
	text-align: center;	
	position: relative;
    cursor: pointer;
	overflow: hidden;
}
#menu li span{
	font-size: 24px;
	line-height: 50px;
	color: #fff;
}
#menu li:nth-child(1) span{
	font: 32px/50px "微软雅黑";
}
#menu li:nth-child(2) span{
	transform: rotate(90deg);
}
#menu li:nth-child(3) span{
	display: block;
	width: 26px;
	height: 26px;
	border-radius: 50%;
	border: 2px solid #fff;
	margin: 10px 0 0 10px;
}
#menu li:nth-child(4) span{
	display: block;
	width: 26px;
	height: 26px;
	border: 1px solid #fff;
	margin: 11px 0 0 11px;
}
#sidebar{
	width: 230px;
	height: 100%;
	background: #808080;
	position: absolute;
	top: 0;
	right: -230px;
	transition: 0.5s ease-out;
    display: none;
}
.sidebar-draw{
	height: 100%;
    background: #ccc;
	display: none;
    ul{
        height: 100%;
        display: flex;
        flex-direction: column;
        li{
            width: 100%;
            flex: 1;
	        border-bottom: 1px solid #000;
            &:hover{
	            background: #000;
            }
            span{
                border-radius: 5px;
                display: block;
	            width: 180px;
	            background: #fff;
            }
        }
    }
}

.sidebar-draw ul li:nth-child(1) span{
	height: 3px;
	margin: 28.5px auto 0;
}
.sidebar-draw ul li:nth-child(2) span{
	height: 6px;
	margin: 27px auto 0;
}
.sidebar-draw ul li:nth-child(3) span{
	height: 9px;
	margin: 25.5px auto 0;
}
.sidebar-draw ul li:nth-child(4) span{
	height: 12px;
	margin: 24px auto 0;
}
.sidebar-draw ul li:nth-child(5) span{
	height: 15px;
	margin: 22.5px auto 0;
}
.sidebar-draw ul li:nth-child(6) span{
	height: 18px;
	margin: 21px auto 0;
}
.sidebar-color{
    height: 100%;
    background: #000;
	display: none;
    ul{
        height: 100%;
        display: flex;
        flex-direction: column;
        li{
            flex: 1;
            margin: 10px 0;
        }
    }
}

.sidebar-color li{
	height: 30px;
	margin-bottom: 10px;
}
.sidebar-color li:hover{
	border: 2px solid #fff;
	box-sizing: border-box;
}
.first-screen{
	width: 100%;
	height: 100%;
	background: #1B1B1B;
	overflow: hidden;
	position: relative;
	z-index: 1;
}
.first-screen span{

	width: 100px;
	height: 100px;
	border-radius: 50%;
	position:absolute;
	left: 50%;
	top: 50%;
	margin-left: -50px;
	margin-top: -50px;
	background: #fff;
	overflow: hidden;
	animation: 1.5s 2.5s boost forwards;
}

.first-screen img{

	width: 100px;
	height: 100px;
	border-radius: 50%;
	animation: 2.5s dispear forwards;
}
@keyframes dispear{

	99%{
		opacity: 1;
	}
	100%{

		opacity: 0;
	}
}
@keyframes boost{

	100%{

		transform: scale(20,20);
	}
}

.tip{
	width: 350px;
	height: 100px;
	border: 1px solid #333;
	position: absolute;
	left: 50%;
	margin-left: -175px;
	top: 0;
	z-index: 10;
	border-radius: 15px;
	text-align: center;
	display: none;
	background: #fff;
}
.tip .tip-main{
	margin-top: 30px;
}
.tip .glyphicon{
	width: 30px;
	height: 30px;
	border: 1px solid #333;
	font-size: 16px;
	line-height: 30px;
	border-radius: 50%;
	text-align: center;
	color: #333;
}
.tip .text{
	font: 16px/40px "微软雅黑";
}
.contextmenu{
	position: absolute;
	top: 0;
	left: 0; 
	z-index: 10;
	background: #000;
	border-radius: 10px;
	display: none;
}
.contextmenu li{
	width: 200px;
	height: 50px;
	font: 14px/50px "微软雅黑";
	color: #fff;
	text-indent: 2em;
	border-bottom: 1px dashed #f5f5f5;
	cursor: pointer;
}
.contextmenu li:first-child{
	color: #999;
	cursor: default;
}
.contextmenu li:last-child{
	border-bottom: none;
}
</style>

