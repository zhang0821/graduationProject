<template>
    <section>

        <div class="UItypeS" >
            <div ref="typeName" @click="()=>{showDropMenu=!showDropMenu}">选择类型</div>   
            <ul class="type-list" @click="UItypeChoose" v-if="showDropMenu">
                <li>节点</li>
                <li>布局</li>
                <li>通用组件</li>
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
                <li @click="layoutModify">
                    <span>header</span><i class="header_add">+</i>
                </li>
                <li @click="layoutModify">
                    <span>footer</span><i class="footer_add">+</i>
                </li>
                <li @click="layoutModify">
                    <span>增加tab页</span><i class="tab-icon-add">+</i>
                </li>

                <li @click="layoutModify">
                    <span>减少tab页</span><i class="tab-icon-del">-</i>
                </li>
                
            </ul>

            <ul class="components-list common" v-if="this.UItype==='通用组件'" >
                <li v-for="(comp,index) in comList">
                    <div draggable="true" @dragstart="dragStart" comp-type="common" :data-name="comp.compType">{{comp.compname}}</div>
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
            UItype:'布局',
            comList:[
                {
                    compType:'warnBox',
                    compname:'报警框'
                },
                {
                    compType:'table',
                    compname:'数据表格'
                },
                {
                    compType:'textBox',
                    compname:'文本框'
                },
                {
                    compType:'container',
                    compname:'图片容器'
                },
            ]
        }
    },

    methods: {
        dragStart(e) {
            let compType=e.target.getAttribute('comp-type')
            let componentName = e.target.getAttribute('data-name') 
            let info = {
                compType:compType,
                type: componentName,
                width:300, //给通用组件设定一个最小默认值
                height:80,
                top:e.target.offsetY,
                left:e.target.offsetX
            }
            e.dataTransfer.setData('info', JSON.stringify(info))
        },

        UItypeChoose(e){
            this.UItype=e.target.innerHTML
            this.childMenu=1
            this.showDropMenu=0
            this.$refs.typeName.innerHTML=e.target.innerHTML
        },

        layoutModify(e){
            let operate=e.target.className
            if(operate != ''){
                this.$store.commit('designStore/updateLayoutCon',{operate})        
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
    color:#16A085;
}

.UItypeS{
    width: 100%;
    padding: 5px 0;
    background: #BDC3C7;
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
    padding: 10px 5px;
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
            border-bottom:1px solid #ccc;
        }
        i{
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 1px solid #ccc;
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
