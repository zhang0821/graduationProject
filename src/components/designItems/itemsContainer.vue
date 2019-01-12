<template>
    <section class="preview" @dragover="dragOver" @drop="drop">
        <div ref="preview" class="preview-area" @click="clickPreview"  @keyup.delete="del">
            <node-show :infos="nodeAll" ></node-show>
        </div>
         <!-- 右键菜单 -->

        
    </section>
</template>
<script>
import nodeShow from './utils/nodesInCon'
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
            previewMode: 'pc'
        }
    },
    created(){

    },
    components:{
        nodeShow
    },
    computed:mapState({
        nodeAll:state=>state.designStore.designComponents,
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
            let storeNode={}
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
            // let componentHTML = this.getComponentNode(target)
            // if (componentHTML) {
            //     //添加选中效果
            //     let list = document.querySelectorAll('[data-component-active="true"]')
            //     list.forEach(el => {
            //         el.setAttribute('data-component-active', '')
            //     })
            //     componentHTML.setAttribute('data-component-active', 'true')

            //     //保存到vuex
            //     let currentId = componentHTML.id
            //     let component = this.components.find(component => component.info.id === currentId)
            //     if (component)
            //         this.$store.commit('setState', {
            //             currentComponent: component
            //         })
            // }
        },
        rightClick(e) {
            this.clickPreview(e)
            this.contextmenu.open = false
            this.contextmenu.trigger = this.$refs.contextmenu
            this.contextmenu.style = {
                position: 'fixed',
                left: e.x + 10 + 'px',
                top: e.y - 10 + 'px'
            }
            this.contextmenu.open = true
        },
        del: async function() {
            let components = await this.$store.dispatch('designStore/delComponent', this.current.info.id)
            this.fresh()
        },
    },
}
</script>

<style lang="scss" scoped>
.preview,.preview-area{
    height: 100%;
}
.preview-area{
    border:2px solid #fff;
}
</style>


