<template>
    <section v-if="operateType=='design'" class="designcontainer">
        <ul>
            <li v-for="(tab,index) in Object.keys(tabArr)" :class="{active:index == curTab}" @click="showTab(index)" @dblclick="fileLoad(tabArr[index].name)">{{tab}}</li>
        </ul>


        <div class="preview" ref="preview" @dragover="dragOver" @drop="drop" >
            <div  class="preview-area"  v-for="(tab,index) in Object.keys(tabArr)" v-if="index == curTab" @click="clickPreview"  :style="{backgroundImage: `url(${dynamicImgUrl[index]})`}">
                <nodes-show v-if="!tabArr[index].table.hasSet" :infos="tabArr[index].designComponents" :design="'design'" ></nodes-show>
                <table-gener v-else />
            </div>  
            <!-- 是否注册了报警 -->
            <text-scroll-box v-if="layoutInfo.warnBox.hasSet"></text-scroll-box>
        </div>
        <!-- 文件上传组件 -->
        <div v-if="showUploadBox" class="fileUploadBox">
            <i class="close" @click="finishUpload">x</i>
            <input type="text" v-model="tabName">
            <file-upload :file-done="finishUpload" :tabindex="curTab" :type="'img'"></file-upload>
        </div>
    </section>
    
    <section v-else class="showContainer">
         <ul>
            <li v-for="(tab,index) in Object.keys(tabArr)" :class="{active:index == curTab}" @click="showTab(index)" >
                <p>{{tabArr[tab].name}}</p>
            </li>
        </ul>
        <div class="preview" ref="preview" >
            <!-- :style="{backgroundImage: 'url(' + require("../../../userUpload"+usr+"/"+index+".jpg")+ ')'}"会在编译时打包到dist目录内 -->
            
            <div  class="preview-area"  v-for="(tab,index) in Object.keys(tabArr)"  v-if="index == curTab && tabArr[index].imgload" :style="{backgroundImage: `url(${dynamicImgUrl[index]})`}" > 
                <nodes-show v-if="!tabArr[index].table.hasSet" :infos="tabArr[index].designComponents" :design="'show'"></nodes-show>
                <table-gener design="false" v-else />
            </div>

            <div  class="preview-area"  v-for="(tab,index) in Object.keys(tabArr)"  v-else-if="index == curTab && !tabArr[index].imgload"  > 
                <nodes-show v-if="!tabArr[index].table.hasSet" :infos="tabArr[index].designComponents" :design="'show'"></nodes-show>
                <table-gener design="false" v-else />

            </div>   

        </div>
    </section>
    
</template>
<script>
import utils from './utils'
import showItems from '../showItems'
import { mapState, mapMutations } from 'vuex'

export default {
    data(){
        return {
            /**tab页背景图片地址 */
            imgburl:"/static/userUpload/"+this.$store.state.dataTrans.username+"/bgImgOftab",
            dynamicImgUrl:[],
            showType: '预览',
            curTab:'0',
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
            showUploadBox:false,
        }
    },
    props:['operateType'],
    created(){
       //关于背景图片，如果已经设置了图片，则在初始化时，加载图片
       Object.keys(this.tabArr).forEach(index=>{
            console.log('进入图片预览。当前index是',index)           
           if(this.tabArr[index].imgload){
               console.log('遍历对象后，此时的index',index)
               this.dynamicImgUrl[index] ="/static/userUpload/"+this.$store.state.dataTrans.username+"/bgImgOftab"+index+'.png?hah=hah'
            //    this.dynamicImgUrl[index] ="/static/userUpload/"+this.$store.state.dataTrans.username+"/bgImgOftab"+index+'.png'
           }
           if(this.tabArr[index].table.hasSet){
               this.dynamicImgUrl[index]=null
           }
       })
       
    },
    components:{
        ...utils,
        ...showItems
    },
    computed:{
        ...mapState({
            tabArr:state=>state.designStore.pageTabs,
            layoutInfo:state=>state.designStore.layoutInfo,
        }),
        tabName:{
            get:function(){
                return this.$store.state.designStore.pageTabs[this.curTab].name
            },
            set:function(value){
                this.$store.commit('designStore/updateTabName',{'tabIndex':this.curTab,'name':value})
            }
        },
        curWarnTab:function(){
            return this.$store.state.dataTrans.curWarnTab
        }
    },
    updated(){

    },
    mounted(){
        
    },
    watch:{
        curWarnTab(newVal,val){ //普通的监听
            console.log('curWarnTab监测到变化',newVal)
        },
        'tabArr':{//深度监听，可监听到对象、数组的变化
            handler(val, oldVal){
                console.log("tabArr"+val);//但是这两个值打印出来却都是一样的
            },
            deep:true
        }
    },
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
            addNode:'designStore/addNodes',
            updateTable:'designStore/updateTable',
            undateNodesPos:'designStore/undateNodesPos',
            updateLayoutState:'designStore/updateLayoutState'

        }),
        dragOver(e) {
            console.log('dragOver函数进入')
            e.preventDefault()
        },
        drop(e) { //松开拖放,e是容器元素
         console.log("info具体信息",e.dataTransfer.getData('info'))
            let info = JSON.parse(e.dataTransfer.getData('info')) //获取拖拽暂存的数据
            //若此时没有初始化tab页，则也不允许节点元素被拖拽进入
            //CODE视图的文字拖动也会触发此事件，这里屏蔽掉
            if (e.target.className.indexOf('sound-code') !== -1 || e.target.className.indexOf('hljs') !== -1)
                return
            if(info.compType == 'node' ){
                if(Object.keys(this.tabArr).length < 0 || this.tabArr[this.curTab].table.hasSet){//或者当前为表格页
                    return
                }
                let mouse=this.getCurPos(e)
                if(info.changePos){
                     Object.assign(info,mouse)
                    this.undateNodesPos(info)
                }else{
                    let storeNode={
                        tabIndex:this.curTab
                    }
                    Object.assign(storeNode,mouse,info)
                    console.log('存储元素',storeNode)
                    this.addNode(storeNode)
                }
                
            }else{
                if(info.type == 'table'){
                    console.log('进入增加table到当前页')
                    this.updateTable(this.curTab)
                    return
                }
                let storeLayout={
                    [info.type]:{
                        hasSet:1
                    }
                }
                Object.assign(storeLayout[info.type],info)
                this.updateLayoutState(storeLayout)
            }
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
            //并加载当前tab页背景图为刚才上传的背景图
            this.dynamicImgUrl[this.curTab]="/static/userUpload/"+this.$store.state.dataTrans.username+"/bgImgOftab"+this.curTab+".png?date="+(new Date()).getTime()
            this.$forceUpdate()
        }
    },
}
</script>

<style lang="scss" scoped>
.showContainer,.designcontainer{
    height: 100%;
    display: flex;
    flex-direction: column;
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
    .preview{
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        .preview-area{
            flex: 1;
            border:2px solid #fff;
            background-color: #000;
            background-repeat: no-repeat;
            // background-image: url(../../../userUpload/zhang/bgImgOftab0.jpg);
            background-size: 100% 100%;

        }
    }
}

.fileUploadBox{
    position:absolute;
    padding: 26px 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border: 2px solid #000;
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


