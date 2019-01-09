<template>
    <div class="designPage">
    
    
    
        <div class="header">
    
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
                    <li @click="sourceCode">源码</li>
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
    
            <div class="itemsCon">
                <componets-box class="myComp" ref="componetsBox" />
                <!-- myComponents 使用ref属性后的元素，该元素则可以通过 this.$refs.myComponents 被作为DOM元素引用-->
            </div>
            <div class="designCon">
                <componets-con></componets-con>
            </div>
            <div class="toolCon">
                其他工具位置——颜色更改、文本编辑等
                <!-- <tools></tools> -->
            </div>
        </div>
    
    </div>
</template>
<script>
import componetsBox from '../components/designItems/componetsBox'
import componetsCon from '../components/designItems/itemsContainer'

    export default {
        name: 'Design',
        data() {
            return {
            }
        },
        components:{
            componetsBox,
            componetsCon
        },
        created() {
        },
        methods: {
            /**编辑 */
            draw() {
            },
    
            /**预览 */
            preview() {
            },
    
            /**完成 */
            complete() {
            },
    
            /**保存 */
            save() {
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
            width: 300px;
            height: 100%;
            background: rgb(114, 106, 161);

        }
        .toolCon{
            width: 200px;
            height: 100%;
            background: rgb(185, 133, 181);
        }
        
    }
}
.myComp{
    width:100%;
    height: 100%;
    overflow-y:auto;
    background:indianred;

}
</style>