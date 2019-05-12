// 图片容器，文字容器，工具容器
<template>

    <div class="myCon" ref="myCon">
        <div ref="con" class="con" :class="[picked]"  @dblclick="loadImg" :style="{backgroundImage: `url(${dynamicImgUrl})`}"
        
            v-conresize="{type:'container',styleLimit:{},fn:conResizeFn}">

        </div>
        <div ref="myToolbar" class="myToolbar">
            <input type="radio" id="rect" value="rect" v-model="picked">
            <label for="rect">矩形</label>
            <input type="radio" id="circle" value="circle" v-model="picked">
            <label for="circle">圆形</label>
            <toolbar v-if="design" :remove="remove"></toolbar>
        </div>
        <div v-if="design && showUploadBox" class="fileBox">
            <file-upload :file-done="finishUpload"  :type="'img'"></file-upload>
        </div>
    </div>
   
    
</template>

<script>
import toolbar from './toolbar'
import fileUpload from './fileUpload'
export default {
    data(){
        return {
            showUploadBox:true,
            picked:'rect',
            dynamicImgUrl:''
        }
    },
    props:{
        conNo:{
            type:Number,
            default:0
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
    components:{
        toolbar,
        fileUpload
    },
    created(){

    },
    mounted(){

    },
    methods:{
        remove(){
            console.log('container中的remove被调用')
            let obj={
                type:'container',
                remove:true
            }
            this.showUploadBox=false
            this.dragstopCb(obj)
        },
        loadImg(){
            console.log('loadImgloadImgloadImg')
            this.showUploadBox=true
        },
        finishUpload(){
            console.log('文件传输完成，关闭文件传输框')
            this.showUploadBox=false
            //并加载当前tab页背景图为刚才上传的背景图
            this.dynamicImgUrl=`/static/userUpload/${this.$store.state.dataTrans.username}/container${this.conNo}.png?date=${(new Date()).getTime()}`
            this.$forceUpdate()
        },
        conResizeFn(obj){
            console.log('改变大小后，返回的数据是：',obj)
            // this.$refs.myCon.style.width=obj.w
            // this.$refs.con.style.height=obj.h
            
            // this.modifyLConStyle(obj)
            
        },
    }
}
</script>

<style lang="scss" scoped>
.myCon{
    width: 50px;
    .con{
        height: 50px;
        width: 100%;
        background: red;
        &.circle{
            border-radius: 50% 50%;
        }
    }
    .myToolbar{
        width: 50px;
        display: flex;
    }
    img{

    }
}
.fileBox{
    position:absolute;
    padding: 26px 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border: 2px solid #D35400;
    .close{
        display: block;
        width: 18px;
        height: 18px;
        margin-top: -22px;
        &:hover{
            cursor: pointer;
        }
    }
}
</style>

