<template>
<vue-draggable-resizable  drag-handle='.icon' :resizable="design"  :draggable="design" @dragstop="dragStop" @dragging="onDragging"
                 :x="detialInfo.left" :y="detialInfo.top" :w="detialInfo.width" :h="detialInfo.height" :minh="30" :minw="50" :parent="true" >
     <div class="dragtestBox">
        
        <section v-if="design && notSave">

            <label for="" class="edit ">移动</label>
            <input ref="textBox" type="text" placeholder="键入文本" v-model="saveObj.text" :style="{fontSize: saveObj.fontSize}" >
        </section>
        <section v-else>
            <div class="text "  ref="textBox" :style="{fontSize: detialInfo.fontSize}" v-resizable="{type:'textBox',fn:resizeFn}">
               这是文本{{detialInfo.text}}
            </div>
        </section>
       
    </div>
    <div class="icon" ref="icon" v-if="design==true">
        <i @click="fontSizeUp">+</i>
        <i @click="fontSizeDown">-</i>
        <i @click="save(saveObj)">√</i>
        <i @click="remove">×</i>
        <i @click="edit">e</i>
    </div>
</vue-draggable-resizable>
</template>
<script>
import { setTimeout } from 'timers';
export default {
    data(){
        return {
            notSave:true,
            timer:null,//用于消抖
            saveObj:{
                text:null,
                fontSize:'25px',
            }
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
            default:false
        }
    },
    created(){
        console.log('初始化进入textBox',this.detialInfo)
        
    },
    methods:{
        dragStop(x,y){
            
           let obj={
               left:x,
               top:y
           }  
           
        },
        onDragging(){
            // this.notSave=true
        },
        fontSizeUp(){
            if(!this.saveObj.text)
                return
            let num=parseInt(this.saveObj.fontSize)
            num++
            if(num>40){
                num=40
            }
            this.saveObj.fontSize=num+'px'
            this.save(this.saveObj)
        },
        fontSizeDown(){
            if(!this.saveObj.text)
                return
            let num=parseInt(this.saveObj.fontSize)
            num--
            if(num<10){
                num=10
            }
            this.saveObj.fontSize=num+'px'
            this.save(this.saveObj)

        },
        save(obj){
            console.log('this.saveObj.text',this.saveObj.text)
            if(!this.saveObj.text){
                alert('请键入文本！')
                return 
            }
            let returnObj=Object.assign(this.detialInfo,obj)
            console.log('save中要被存储的信息是',returnObj)
            this.dragstopCb(returnObj)
            this.notSave=false
        },
        remove(){
            console.log('remove北风调用')
            let obj={
                type:'textBox',
                remove:true
            }
            this.saveObj.text='.'
            this.dragstopCb(obj)
        },
        edit(){
            this.notSave=true
        },
        resizeFn(obj){
            console.log('textBox中的resizeFn被调用！！！',obj)
            let newObj={
                width:obj.w,
                height:obj.h
            }
            this.save(newObj)

        }
    }
}
</script>
<style lang="scss" scoped>
.dragtestBox{
    // width:auto;
    // position: absolute;
    // border:1px solid #ccc;
    .edit{
        display: inline-block;
        height: 100%;
        &:hover{
            cursor: move;
        }
    }
    input{
        height: auto;
        padding: 5px 10px;
    }
    
    
    .text{
        width: 100%;
        height: 100%;
        background: #000;
        color: red;
    }

}
    .icon{
        height: 20px;
        width: 100%;
        background: #ccc;
        i{
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 1px solid #000;
            border-radius: 50% 50%;
            margin-left: 10px;
            text-align: center;
            line-height: 20px;
            font-size: 16px;
            &:hover{
                background: #1ABC9C;
                color: #fff;
                cursor: pointer;
            }
        }
    }
</style>

