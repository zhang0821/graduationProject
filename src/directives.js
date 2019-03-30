import Vue from 'vue'


// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('resizable', {
    bind(el, binding) {
        const value =binding.expression //传入的值
        console.log('此次指令引用传入的值是',value)

        el.onmousedown = (e) => {
            
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;
            const disY= e.clientY - el.offsetTop;

            // console.log('鼠标横坐标',e.clientX,'元素左边位置',el.offsetLeft,'当前高度差值是',disX) 
            // console.log('鼠标纵坐标',e.clientY,'元素上部位置',el.offsetTop,'当前高度差值是',disY) 


            document.onmousemove = function (e) {
                e.preventDefault(); // 移动时禁用默认事件

                // 通过事件委托，计算移动的距离 
                // let w = e.clientX - disX;
                // let h = e.clientY - disY;
                let w = e.clientX - el.offsetLeft;
                let h = e.clientY - el.offsetTop;
                if(h<10){
                    h=10
                }

                if(w<10){
                    w=10
                }
                el.style.width = `${w}px`
                el.style.height = `${h}px`
                    //  console.log('当前元素宽高',w,'，',h) 


            };

            document.onmouseup = function (e) {
                document.onmousemove = null
                document.onmouseup = null
            };
        }  
    }
})

Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 聚焦元素
        el.focus()
    }
})