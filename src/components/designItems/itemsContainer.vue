<template>
    <section class="preview" @dragover="dragOver" @drop="drop">
        <h2>下面是元素放置区域SJDJD </h2>
        <div ref="preview" class="preview-area" @click="clickPreview"  @keyup.delete="del">

        </div>
         <!-- 右键菜单 -->

        
    </section>
</template>
<script>

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
    methods: {
        dragOver(e) {
            e.preventDefault()
        },
        drop(e) { //松开拖放,e是容器元素

            //CODE视图的文字拖动也会触发此事件，这里屏蔽掉
            if (e.target.className.indexOf('sound-code') !== -1 || e.target.className.indexOf('hljs') !== -1)
                return

            let isNest = e.target.className.indexOf('preview') === -1 && e.target.id !== 'placeholder'
            let info = JSON.parse(e.dataTransfer.getData('info'))
            console.log('当前元素是',info)
           
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
.preview{
    width: 100%;
    height: 100%;
    position: relative;
}
</style>


