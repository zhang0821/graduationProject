<template>
    <div class="designPage">
           
        <div class="header" v-if="previewStatus==0">
    
            <div class="title">
                <h1>可视化组态布局</h1>
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
    
            <div class="itemsCon" v-if="previewStatus==0">
                <componets-box class="myComp" ref="componetsBox" />
                <!-- myComponents 使用ref属性后的元素，该元素则可以通过 this.$refs.myComponents 被作为DOM元素引用-->
            </div>
            <div class="designCon">
                <componets-con></componets-con>
                <loading v-if="isLoging" marginTop="-30%"></loading>
            </div>

            <!-- 配置相关细节信息 -->
            <div class="toolCon" v-if="detialToolsBox.show && previewStatus==0">
                <componets-set :curtype="detialToolsBox"></componets-set>
            </div>
        </div>
    
    </div>
</template>
<script>
import componetsBox from '../components/designItems/componetsBox'
import componetsCon from '../components/designItems/itemsContainer'
import componetsSet from '../components/designItems/infoSetBox'
import loading from '../components/showItems/Loading'
import { mapState, mapActions } from 'vuex';

    export default {
        name: 'Design',
        data() {
            return {
                usr:'',
                isLoging:0
            }
        },
        components:{
            componetsBox,
            componetsCon,
            componetsSet,
            loading
        },
        created() {
            this.usr=this.$route.params.usr
        },
        computed:mapState({
            detialToolsBox:state=>state.designStore.detialToolsBox,
            previewStatus:state=>state.designStore.previewClick
        }),
        methods: {          
            ...mapActions({
                postData:'designStore/postToServer'
            }),
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
</style>