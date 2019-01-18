<template>
    <section>

        <div class="UItypeS" >
            <div ref="typeName" @click="()=>{showDropMenu=!showDropMenu}">选择类型</div>   
            <ul class="type-list" @click="UItypeChoose" v-if="showDropMenu">
                <li>节点</li>
                <li>布局</li>
            </ul>          
        </div>
        
        <div v-if="showDropMenu==0 && childMenu">
            <ul class="components-list" v-if="this.UItype==='节点'">
                <li >
                    <temhum :drag-start-fn="dragStart" />
                </li>
                <li>
                    <smoke :drag-start-fn="dragStart"/>
                </li>
                <li>
                    <door :drag-start-fn="dragStart"/>
                </li>
            </ul>

            <ul class="components-list layout" v-if="this.UItype==='布局'">
                <li @click="layoutTab">
                    <span>增加tab页</span><i class="tab-icon-add">+</i>
                </li>

                <li @click="layoutTab">
                    <span>减少tab页</span><i class="tab-icon-del">-</i>
                </li>
                
            </ul>
        </div>
    </section>
</template>
<script>
import Vue from 'vue'
import store from '@/store'
import { mapState, mapActions, mapMutations } from 'vuex'
import nodes from './list/nodes'
import iViewUiList from './list/layout'
export default {
    name: 'componentsBox',
    data() {
        return {
            showDropMenu:0,
            childMenu:1,
            UItype:'布局'
        }
    },

    methods: {
        dragStart(e) {
            let componentName = e.target.getAttribute('data-name')
            console.log(' e.target:', e.target.style.backgroundColor)
            let info = {
                type: componentName,
                width:e.target.offsetWidth,
                height:e.target.offsetHeight,
                color:e.target.style.background
            }
            e.dataTransfer.setData('info', JSON.stringify(info))
        },

        UItypeChoose(e){
            this.UItype=e.target.innerHTML
            this.childMenu=1
            this.showDropMenu=0
            this.$refs.typeName.innerHTML=e.target.innerHTML
        },

        layoutTab(e){
            let operate=e.target.className
            if(operate != ''){
                this.$store.commit('designStore/updateLayout_tab',{operate})        
            }
        }
    },
    watch:{
        showDropMenu:(val,oldVal)=>{
            console.log('监听到showDropMenu变化,现在是',val)
        }
    },
    computed: {
    },
    mounted() {

    },
    components: {
        ...nodes,
        ...iViewUiList
    }
}
</script>
<style lang="less" scoped>
section{
    color:#fff;
}

.UItypeS{
    width: 100%;
    padding: 5px 0;
    background: #ccc;
    border-bottom: 1px solid #fff;
    text-align: center;
    &:hover{
        cursor: pointer;
    }
    .type-list{
        margin-top: 10px;
        border-top: 1px solid #fff;

        li{
            list-style: none;
            padding: 5px 0;
            margin-bottom: 10px;
            &:hover{
                cursor: pointer;
                background: #fff;
                color:rgb(29, 146, 182);
            }
        }
    }

}

.components-list {
    width: 100%;
    height: 100%;
    list-style: none;
    padding: 10px 0;
    li {
        cursor: move!important;
        width: auto;
        height: auto;
        min-height: 50px;
        font-size: 18px;
        -webkit-user-select: none;
        transform: scale(0.7)translateX(-15%);
        transition: transform .2s;
        &:hover {
            transform: scale(1) translateX(5%);
        }
        div {
            vertical-align: middle;
        }
        .layoutItem{
            display: block;
            padding:0 2px;
            text-align: center;
            border-bottom:1px solid #fff;
        }
        i{
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 1px solid #fff;
            border-radius: 50% 50%;
            margin-right: 10px;
            line-height: 20px;
            text-align: center;
            font-size: 1em;
        }
    }
    &.layout{
        li{
            transform: none ;
            transition: all 0 ease 0;
            &:hover{
                transform: none ;
                cursor: default;
            }
            i{
                transform: scale(0.7)translateX(-15%);
                transition: transform .2s;
                &:hover {
                    transform: scale(1) translateX(5%);
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
