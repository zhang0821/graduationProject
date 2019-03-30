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
                    <li @click="save">保存</li>
                    <li @click="emptyState()">清空</li>
                </ul>
                <ul>
                    <li @click="step_forward">上一步</li>
                    <li class="drop-rubish" @dragover.prevent @drop="removeIt" >回收站</li>
                </ul>
            </div>
    
        </div>
    
        <div class="main">
    
            <div class="itemsCon" v-if="designStore.previewClick==0">
                <componets-box class="myComp" ref="componetsBox" />
                <!-- myComponents 使用ref属性后的元素，该元素则可以通过 this.$refs.myComponents 被作为DOM元素引用-->
            </div>
            <div class="designCon">
                <div class="basicInfo">
                    <div @click="showMediaUpload">点击重新添加告警音乐</div>
                    <!-- <img :src="require('../../userUpload/'+usr+'/bgImgOftab0.png')" alt="测试动态路径图片"> -->
                    <div>
                        <input type="text" v-model="title"/>
                    </div>
                    <div>
                        <input type="text" v-model="subtitle" />                   
                    </div>
                </div>
                <div class="nodePosInfo">
                    <componets-con :operate-type="'design'"></componets-con>
                </div>
                <loading v-if="isLoging" marginTop="-30%"></loading>
            </div>

            <!-- 配置相关细节信息 -->
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
                'emptyState',
                'deleteItem'
            ]),
            showMediaUpload(){
                this.mediaUpload=true
                console.log('showUploadBox当前状态值',this.mediaUpload)
            },
            closeBox(){
                this.mediaUpload=false
                console.log('showUploadBox当前状态值',this.mediaUpload)

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
            
            // if(info.compType == 'node' ){
            //     if(Object.keys(this.tabArr).length < 0 || this.tabArr[this.curTab].table.hasSet){//或者当前为表格页
            //         return
            //     }
            //     let mouse=this.getCurPos(e)
            //     if(info.changePos){
            //          Object.assign(info,mouse)
            //         this.undateNodesPos(info)
            //     }else{
            //         let storeNode={
            //             tabIndex:this.curTab
            //         }
            //         Object.assign(storeNode,mouse,info)
            //         console.log('存储元素',storeNode)
            //         this.addNode(storeNode)
            //     }
                
            // }else{
            //     if(info.type == 'table'){
            //         console.log('进入增加table到当前页')
            //         this.updateTable(this.curTab)
            //         return
            //     }
            //     let storeLayout={
            //         [info.type]:{
            //             hasSet:1
            //         }
            //     }
            //     Object.assign(storeLayout[info.type],info)
            //     this.updateLayoutState(storeLayout)
            // }
            },
            draw() {
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
                }).catch((err) => {
                    console.log('postToServer错误')
                });
                //重新跳转到登录界面
                 this.$router.push({
                    name:'Login'
                })
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
            .basicInfo{
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