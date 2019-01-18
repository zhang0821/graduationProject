<template>
    <section class="designcontainer">
        <ul>
            <li v-for="(tab,index) in Object.keys(tabArr)" :class="{active:index == curTab}" @click="showTab(index)" @dblclick="fileLoad(index)">{{tab}}</li>
        </ul>

        <!-- <div v-for="(tab,index) in Object.keys(tabArr)" v-show="index == curTab"> -->

            <div class="preview" ref="preview" @dragover="dragOver" @drop="drop">

                <div  class="preview-area"  v-for="(tab,index) in Object.keys(tabArr)" v-if="index == curTab" @click="clickPreview" >
                    <nodes-show :infos="tabArr[index].designComponents" ></nodes-show>
                </div>  

            </div>
        <!-- </div> -->
        <div v-if="showUploadBox" class="fileUploadBox">
            <!-- <p>{{curTab}}</p> -->
            <file-upload :file-done="finishUpload" :tabindex="curTab"></file-upload>
        </div>
    </section>
    
    
</template>
<script>
import utils from './utils'
import { mapState, mapMutations } from 'vuex'

export default {
    data(){
        return {
            showType: '预览',
            contextmenu: {
                trigger: null,
                open: false,
                style: {}
            },
            popover: {
                trigger: null,
                open: false
            },
            insertPosition: {
                position: null,
                component: null
            },
            previewMode: 'pc',
            /**tab也切换 */
            curTab:'0',
            showUploadBox:false
        }
    },
    created(){

    },
    components:{
        ...utils
    },
    computed:mapState({
        tabArr:state=>state.designStore.pageTabs
    }),
    methods: {
        getCurPos(e){
            e = e || window.event
            var D = document.documentElement
            var posInfo
            if (e.pageX){
                posInfo= {
                    x: e.pageX,
                    y: e.pageY
                }
            }else { 
                posInfo={
                    x: e.clientX + D.scrollLeft - D.clientLeft,   
                    y: e.clientY + D.scrollTop - D.clientTop  
                }  
            }
            return{
                posx:Math.floor((posInfo.x-this.$refs.preview.getBoundingClientRect().left)/this.$refs.preview.clientWidth*10000)/10000,
                posy:Math.floor((posInfo.y-this.$refs.preview.getBoundingClientRect().top)/this.$refs.preview.clientHeight*10000)/10000
            }
        },
        ...mapMutations({
            addNode:'designStore/addNodes'
        }),
        dragOver(e) {
            e.preventDefault()
        },
        drop(e) { //松开拖放,e是容器元素
            //若此时没有初始化tab页，则也不允许元素被拖拽进入
            if(Object.keys(this.tabArr).length < 0){
                return
            }

            let storeNode={
                tabIndex:this.curTab
            }
            //CODE视图的文字拖动也会触发此事件，这里屏蔽掉
            if (e.target.className.indexOf('sound-code') !== -1 || e.target.className.indexOf('hljs') !== -1)
                return

            let mouse=this.getCurPos(e)
            console.log("info具体信息",e.dataTransfer.getData('info'))
            let info = JSON.parse(e.dataTransfer.getData('info'))
            Object.assign(storeNode,mouse,info)
            console.log('存储元素',storeNode)
            this.addNode(storeNode)

        },
        clickPreview(e) {
            let target = e.target
            e.preventDefault()
        },
        showTab(tab){
            this.curTab=tab
        },
        /**双击添加背景图片 */
        fileLoad(tabIndex){
            console.log('tab页面：',tabIndex,'执行双击函数')
            this.showUploadBox=true
        },
        /**文件上传完成够组件传递的回调 */
        finishUpload(){
            console.log('文件传输完成，关闭文件传输框')
            this.showUploadBox=false
        }
    },
}
</script>

<style lang="scss" scoped>
.designcontainer{
    // height: 100%;
    ul{
        width: 100%;
        display: flex;
        margin: 0;
        color:#fff;
        li{
            list-style: none;
            padding: 5px 30px;
            border-radius: 20px 20px 0 0;
            border:2px solid #fff;
            background: rgb(205,92,92);
            border-bottom: none;
            &.active,&:hover{
                cursor: pointer;
                padding: 6px 35px;
                background: #fff;
                border-color: rgb(205,92,92);
                color: rgb(205,92,92);
            }

        }
    }
}
.preview,.preview-area{
    height: 100%;
}
.preview-area{
    border:2px solid #fff;
}
.fileUploadBox{
    position:absolute;
    padding: 10px 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border: 2px solid #ccc;

}
</style>


