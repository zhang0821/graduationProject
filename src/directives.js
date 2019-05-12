import Vue from 'vue'


// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('resizable', {
    bind(el, binding) {
        const value= binding.expression //传入的值
        console.log('此次指令引用传入的值是',value)

        const obj=binding.value
        console.log('传入的value是：',obj)
        let XYCallback={
            w:null,
            h:null,
            type:obj.type
        }
        el.onmousedown = (e) => {
            
            // console.log('拖拽时相关信息：e.clientY:',e.clientY,'el.offsetTop:',el.offsetTop,'el.offsetHeight:',el.offsetHeight)
            if((e.clientY-el.offsetTop) < (Math.floor(el.offsetHeight*8/10))){
                console.log('此时不能拖动')
                return
            }
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;
            const disY= e.clientY - el.offsetTop;
            // console.log('鼠标横坐标',e.clientX,'元素左边位置',el.offsetLeft,'当前高度差值是',disX) 
            // console.log('鼠标纵坐标',e.clientY,'元素上部位置',el.offsetTop,'当前高度差值是',disY) 
            document.onmousemove = function (e) { //要全局绑定
                e.preventDefault(); // 移动时禁用默认事件

                // 通过事件委托，计算移动的距离 
                // let w = e.clientX - disX;
                // let h = e.clientY - disY;

                //鼠标也随之移动
                // let l=e.clientX-disX
                // let t=e.clientY-disY
                // el.style.left=l+'px'
                // el.style.top=t+'px'

                let w = e.clientX - el.offsetLeft;
                let h = e.clientY - el.offsetTop;
                if(h<10){
                    h=10
                }
                if(w<10){
                    w=10
                }
                if(obj.styleLimit){
                    if(obj.styleLimit.w){
                        el.style.height = `${h}px`
                    }
                    if(obj.styleLimit.h){
                        el.style.width = `${w}px`                        
                    }
                }else{
                    el.style.width = `${w}px`
                    el.style.height = `${h}px`
                }
                

                //保存这个宽高
                XYCallback.w=w
                XYCallback.h=h
                obj.fn.call(null,XYCallback)
            };
            document.onmouseup = function (e) {
             
                // obj.fn.call(null,'hello')
                obj.fn.call(null,XYCallback)
                document.onmousemove = null
                document.onmouseup = null
            };
        }  
    },
    // update(el,bind){
    //     fn.call(null,el)
    // }
})

Vue.directive('conresize', {
    bind(el, binding) {
        const value= binding.expression //传入的值
        console.log('conresize此次指令引用传入的值是',value)

        const obj=binding.value
        console.log('conresize传入的value是：',obj)
        let XYCallback={
            w:null,
            h:null,
            type:obj.type
        }
        el.onmousedown = (e) => {
            console.log('物体此时的宽高：',el.style.width,el.style.height)
            
            console.log('拖拽时相关信息：e.clientY:',e.clientY,'el.offsetTop:',el.offsetTop,'el.offsetHeight:',el.offsetHeight)
            if((e.clientY-el.offsetTop) < (Math.floor(el.offsetHeight*8/10))){
                console.log('conresize此时不能拖动')
                return
            }
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;
            const disY= e.clientY - el.offsetTop;
            // console.log('鼠标横坐标',e.clientX,'元素左边位置',el.offsetLeft,'当前高度差值是',disX) 
            // console.log('鼠标纵坐标',e.clientY,'元素上部位置',el.offsetTop,'当前高度差值是',disY) 
            document.onmousemove = function (e) { //要全局绑定
                e.preventDefault(); // 移动时禁用默认事件

                // 通过事件委托，计算移动的距离 
                // let w = e.clientX - disX;
                // let h = e.clientY - disY;

                //鼠标也随之移动
                // let l=e.clientX-disX
                // let t=e.clientY-disY
                // el.style.left=l+'px'
                // el.style.top=t+'px'

                let w = e.clientX - el.offsetLeft;
                let h = e.clientY - el.offsetTop;
                if(h<10){
                    h=10
                }
                if(w<10){
                    w=10
                }
                if(obj.styleLimit){
                    if(obj.styleLimit.w){
                        el.style.height = `${h}px`
                    }
                    if(obj.styleLimit.h){
                        el.style.width = `${w}px`                        
                    }
                }else{
                    el.style.width = `${w}px`
                    el.style.height = `${h}px`
                }
                

                //保存这个宽高
                XYCallback.w=w
                XYCallback.h=h
                obj.fn.call(null,XYCallback)
            };
            document.onmouseup = function (e) {
             
                // obj.fn.call(null,'hello')
                obj.fn.call(null,XYCallback)
                document.onmousemove = null
                document.onmouseup = null
            };
        }  
    },
    // update(el,bind){
    //     fn.call(null,el)
    // }
})
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 聚焦元素
        el.borderColor='red';
    }
})

Vue.directive('location', {
    bind(el, binding,vnode,oldVnode) {
        const value =binding.expression //传入的值
        // console.log('此次指令引用传入的值是',value)
        //https://www.cnblogs.com/moqiutao/p/8334780.html
        console.log('传入的绑定参数是：',binding.value)
        //传入designStore?
        
    }
})
