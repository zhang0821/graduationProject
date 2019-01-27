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
                    <li @click="empty">清空</li>
                </ul>
                <ul>
                    <li @click="step_forward">上一步</li>
                    <li @click="step_next">下一步</li>
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
                    <div @click="showMediaUpload">
                        点击添加告警音乐
                         
                    </div>
                    <!-- <img :src="require('../../userUpload/'+usr+'/bgImgOftab0.png')" alt="测试动态路径图片"> -->
                    <div>
                        <input type="text" v-model="title" />
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
import { mapState, mapActions, mapMutations } from 'vuex';

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
                designStore:state=>state.designStore,
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
            ...mapActions({
                postData:'designStore/postToServer',
                imgUpLoad:'designStore/imgUpLoad',
            }),
            ...mapMutations({
                updateTitle:'designStore/updateTitle'
            }),
            showMediaUpload(){
                this.mediaUpload=true
                console.log('showUploadBox当前状态值',this.mediaUpload)
            },
            closeBox(){
                this.mediaUpload=false
                console.log('showUploadBox当前状态值',this.mediaUpload)

            },
            /**编辑 */
            draw() {
            },
    
            /**预览 */
            preview() {
            },
    
            /**完成 */
            complete() {
                // 提交信息到服务器
                this.isLoging=1
                this.postData({'usr':this.usr}).then((result) => {
                    console.log('数据提交后服务器返回结果',result)
                    this.isLoging=0
                }).catch((err) => {
                    console.log('postdata错误')
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
    
            /**清空 */
            empty() {
                
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
    background: #699;
    display: flex;
    flex-direction: column;
    .header{
        width: 100%;
        height: 100px;
        background: #000;
        display: flex;
        justify-content: space-between;
        .title{
            line-height: 100px;margin-left:10px;color: #fff;padding: 0 10px;
        }
        .operate{
            flex: 1;
            display: flex;
            justify-content: space-around;
            ul{
                flex: 1;
                li{
                    display: inline-block;
                    margin-right: 10px;
                    list-style: none;
                    padding: 0 15px;
                    height: 60px;
                    margin-top: 20px;
                    background: #fff;
                    color: #000;
                    border-radius: 5px;
                    line-height: 60px;
                    &:hover{
                        background: #ccc;
                    }
                }
                
            }

        }
    }
    .main{
        flex:1;
        width:100%;
        display:flex;
        background:#699;
        .designCon{
            flex: 1;
            height: 100%;
            background:rgb(139 , 180, 192);
            display: flex;
            flex-direction: column;
            .basicInfo{
                width: 100%;
                height: auto;
                min-height: 100px;
                background: #ccc;
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
            background: rgb(114, 106, 161);

        }
        .toolCon{
            // width: 200px;
            height: 100%;
            padding: 5px 10px;
            max-width: 400px;
            overflow-x:auto;
            background: rgb(185, 133, 181);
        }
        
    }
}
.myComp{
    width:100%;
    height: 100%;
    overflow-y:auto;
    overflow-x:hidden;
    background:indianred;

}
.fileUploadBox{
    position:absolute;
    padding: 26px 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border: 2px solid #000;
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