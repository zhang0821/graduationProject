<template>
    <div class="designPage">
           
        <div class="header" v-if="designStore.previewClick==0">
    
            <div class="title">
                <h1>可视化组态布局</h1>
                <h4>当前登录用户：{{usr}}</h4>
            </div>
    
            <div class="operate">
                <ul>
                    <li @click="draw">编辑</li>
                    <li @click="preview">预览</li>
                </ul>
                <ul>
                    <li @click="complete">提交</li>
                    <li @click="showMediaUpload">资源上传</li>
                    <li @click="emptyState()">清空</li>
                </ul>
                <ul>
                    <li @click="step_forward">上一步</li>
                    <li class="drop-rubish" @dragover.prevent @drop="removeIt" >回收站</li>
                </ul>
            </div>
    
        </div>
    
        <div class="main">
    
            <!-- 图元组件库 -->
            <div class="itemsCon" v-if="designStore.previewClick==0">
                <componets-box class="myComp" ref="componetsBox" />
                <!-- myComponents 使用ref属性后的元素，该元素则可以通过 this.$refs.myComponents 被作为DOM元素引用-->
            </div>


            <div class="designCon">

                <!-- 通用组件放置位置 -->
                <div class="layoutInfo" @dragover.prevent  @drop="layoutDrop">
                    <text-box v-if="designStore.layoutInfo.textBox!=null" :detial-info="designStore.layoutInfo.textBox" :design="true" :dragstop-cb="onDragstop"/>
                    <!-- <drawing-board /> -->
                    <div v-if="designStore.layoutInfo.title">
                        <input type="text" v-model="title"/>
                    </div>
                    <div v-if="designStore.layoutInfo.subtitle">
                        <input type="text" v-model="subtitle" />                   
                    </div>
                </div>

                <!-- 节点组件放置位置 -->
                <div class="nodePosInfo" ref="nodeCon" > 
                    <componets-con :operate-type="'design'" :mouse-pos='getCurPos' :parent-drop="drop" ></componets-con>
                </div>


                <loading v-if="isLoging" marginTop="-30%"></loading>
            </div>

            <!-- 图元信息配置模块 -->
            <div class="toolCon" v-if="designStore.detialToolsBox.show && designStore.previewClick==0">
                <componets-set :tool-box-info="designStore.detialToolsBox" ></componets-set>
            </div>
        </div>



        <!-- 上传文件选择框 -->
        <div class="fileUploadBox" v-if="mediaUpload">
            <i class="close" @click="closeBox">x</i>
            <file-upload :file-done="closeBox" :type="'media'"></file-upload>
        </div>
    </div>
</template>
<script>
import componetsBox from '../components/designItems/componetsBox'
import componetsCon from '../components/designItems/itemsContainer'
import componetsSet from '../components/designItems/infoSetBox'
import loading from '../components/showItems/Loading'
import showItems from '../components/showItems'
import utils from '../components/designItems/utils'
import {createNamespacedHelpers} from 'vuex'
const {mapState, mapMutations, mapActions } = createNamespacedHelpers('designStore')
// import { mapState, mapActions, mapMutations } from 'vuex'

    export default {
        name: 'Design',
        data() {
            return {
                usr:'',
                isLoging:0,
                mediaUpload:false
            }
        },
        components:{
            componetsBox,
            componetsCon,
            componetsSet,
            loading,
            ...showItems,
            ...utils
        },
        created() {
            if(this.$route.params.usr){
                this.usr=this.$route.params.usr
            }else{
                this.usr=this.$store.state.dataTrans.username
            }
        },
        computed:{
            ...mapState({
                designStore:state=>state,

            }), 
            title:{
                get:function(){
                    return this.$store.state.designStore.layoutInfo.title
                },
                set:function(value){
                    this.$store.commit('designStore/updateTitle', {'name':'title','titleText':value})
                },
            }, 
            subtitle:{
                get:function(){
                    return this.$store.state.designStore.layoutInfo.subtitle
                },
                set:function(value){
                   this.$store.commit('designStore/updateTitle',{'name':'subtitle','titleText':value})
                }
            }     
            
        },
        methods: {          
            ...mapActions([
                'imgUpLoad',
                'postToServer'
            ]),
            ...mapMutations([
                'updateTitle',
                'updateTable',
                'addNodes',
                'emptyState',
                'deleteItem',
                'undateNodesPos',
                'updateLayoutState'
            ]),
            showMediaUpload(){
                this.mediaUpload=true
                console.log('showUploadBox当前状态值',this.mediaUpload)
            },
            closeBox(){
                this.mediaUpload=false
                console.log('showUploadBox当前状态值',this.mediaUpload)

            },
            getCurPos(e){
                console.log('外部鼠标坐标获取函数',e)
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
                    posx:Math.floor((posInfo.x-this.$refs.nodeCon.getBoundingClientRect().left)/this.$refs.nodeCon.clientWidth*10000)/10000,
                    posy:Math.floor((posInfo.y-this.$refs.nodeCon.getBoundingClientRect().top)/this.$refs.nodeCon.clientHeight*10000)/10000,
                    left:posInfo.x,
                    top:posInfo.y
                }
            },
            
            drop(e,curTab) { //松开拖放,e是容器元素
                    console.log("info具体信息",e.dataTransfer.getData('info'))
                let info = JSON.parse(e.dataTransfer.getData('info')) //获取拖拽暂存的数据
                //若此时没有初始化tab页，则也不允许节点元素被拖拽进入
                //CODE视图的文字拖动也会触发此事件，这里屏蔽掉
                if (e.target.className.indexOf('sound-code') !== -1 || e.target.className.indexOf('hljs') !== -1)
                    return

                let mouse=this.getCurPos(e)                
                if(info.compType == 'node' ){
                    if(Object.keys(this.designStore.pageTabs).length < 0 || this.designStore.pageTabs[curTab].table.hasSet){//或者当前为表格页
                        return
                    }
                    if(info.changePos){
                        Object.assign(info,mouse)
                        this.undateNodesPos(info)
                    }else{
                        let storeNode={
                            tabIndex:curTab
                        }
                        Object.assign(storeNode,mouse,info)
                        console.log('存储元素',storeNode)
                        this.addNodes(storeNode)
                    }
                    
                }else{
                    if(info.type == 'table'){
                        console.log('进入增加table到当前页')
                        this.updateTable(curTab)
                        return
                    }
                    let storeLayout={
                        [info.type]:{}
                    }
                    Object.assign(storeLayout[info.type],mouse,info)
                    console.log('drop组件保存信息是',storeLayout)
                    this.updateLayoutState(storeLayout)
                }
            },
            /**通用控件放置处 */
            layoutDrop(e){
                console.log('当前元素位置信息：')
                 let mouse=this.getCurPos(e)
                let info = JSON.parse(e.dataTransfer.getData('info')) //获取拖拽暂存的数据
                if (e.target.className.indexOf('sound-code') !== -1 || e.target.className.indexOf('hljs') !== -1)
                    return
                console.log('目前放置到通用组件位置的元素是',info)  
                let storeLayout={
                    [info.type]:' '
                }
                Object.assign(storeLayout[info.type],mouse,info)
                console.log('通用组件保存信息是',storeLayout)
                this.updateLayoutState(storeLayout)

            },
            /**回收站*/
            
            dragover(e){
                //要给 @drop函数和@dragover函数一起绑定使用，在dragover的执行函数中，使用event.preventDefault()阻止其默认行为，可简写为@dragover.prevent
                 event.preventDefault() //必须阻止某一 DOM 元素对 dragover 的默认行为，才能使 drop 事件在其上正确执行：
            },
            removeIt(e){
                console.log("info具体信息",e.dataTransfer.getData('info'))
                
                let info = JSON.parse(e.dataTransfer.getData('info')) //获取拖拽暂存的数据
                
                if (e.target.className.indexOf('sound-code') !== -1 || e.target.className.indexOf('hljs') !== -1)
                    return
                
                console.log('当前要移除的元素是：',info)
                if(info.compType == "node"){ //移除到回收站的是节点
                    let delInfo={
                        tabIndex:info.tabId,
                        id:info.itemId
                    }
                    this.deleteItem(delInfo)
                }
                if(info.compType == "common"){ //移除通用组件
                    this.deleteItem(info.type)
                }
            
            },
            draw() {
            },
            onDragstop(x,y) {
                console.log('文本框停止拖拽后left和top',x,y)
            },
    
            /**预览 */
            preview() {
            },
    
            /**完成 */
            complete() {
                // 提交信息到服务器
                this.isLoging=1
                this.postToServer({'usr':this.usr}).then((result) => {
                    console.log('数据提交后服务器返回结果',result)
                    this.isLoging=0
                    //重新跳转到登录界面
                    this.$router.push({
                        name:'Login'
                    })
                }).catch((err) => {
                    this.isLoging=0
                    console.log('postToServer错误',err)
                });
                
            },
    
            /**保存
             * 将设置信息全部保存到本地
             */
            save() {
                localStorage.setItem('cacheInfo',JSON.stringify(this.$store.state.designStore))
                console.log('保存的信息是',localStorage.getItem('cacheInfo'))
            },
            /**上一步 */
            step_forward() {
    
            },
    
            /**下一步 */
            step_next() {
            }
    
        },
    }
</script>
<style lang="scss">
.designPage{
    width: 100%;
    height: 100%;
    position: absolute;
    // background:#ECF0F1;
    background: transparent;
    display: flex;
    flex-direction: column;
    .header{
        width: 100%;
        height: 100px;
        border-bottom: 3px solid #16A085;
        display: flex;
        justify-content: space-between;
        .title{
            line-height: 100px;margin-left:10px;color: #16A085;padding: 0 10px;
        }
        .operate{
            flex: 1;
            display: flex;
            justify-content: space-around;
            ul{
                flex: 1;
                overflow: hidden;
                li{
                    display: inline-block;
                    margin-right: 10px;
                    list-style: none;
                    padding: 0 15px;
                    height: 60px;
                    margin-top: 20px;
                    // background: #fff;
                    border: 1px solid #1ABC9C;
                    color: #16A085;
                    border-radius: 5px;
                    line-height: 60px;
                    &:hover{
                        cursor: pointer;
                        background: #16A085;
                        color:#fff;
                    }
                    &.drop-rubish{
                        // width: 50px;
                        // height: 60px;
                        margin-left: 20px;
                        // background: url() no-repeat ;
                    }
                }
                
            }

        }
    }
    .main{
        flex:1;
        width:100%;
        display:flex;
        .designCon{
            flex: 1;
            height: 100%;
            // background:rgb(139 , 180, 192);
            display: flex;
            flex-direction: column;
            .layoutInfo{
                width: 100%;
                height: auto;
                min-height: 100px;
                // background: #ccc;
            }
            .nodePosInfo{
                width: 100%;
                flex: 1;
            }
        }
        .itemsCon{
            width: auto;
            min-width: 100px;
            height: 100%;
            border-right: 3px solid #16A085;
            // background: rgba(26, 188, 156,.7);

        }
        .toolCon{
            // width: 200px;
            height: 100%;
            padding: 5px 10px;
            max-width: 400px;
            overflow-x:auto;
            border-left: 3px solid #16A085;
            // background: #95A5A6;
        }
        
    }
}
.myComp{
    width:100%;
    height: 100%;
    overflow-y:auto;
    overflow-x:hidden;
    // background:transparent;
    // border:2px solid indianred;

}
.fileUploadBox{
    position:absolute;
    padding: 26px 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border: 1px solid #000;
    z-index: 10;
    .close{
        display: block;
        width: 18px;
        height: 18px;
        margin-top: -22px;
        &:hover{
            cursor: pointer;
        }
    }
    .setTabName{
        width: 100%;       
    }

}
</style>