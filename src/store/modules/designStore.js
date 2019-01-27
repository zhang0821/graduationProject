

import axios from 'axios'
import Vue from 'vue'
const state = {
    
    // components: [], //预览视图的组件树

    /**存储节点信息 */
    // designComponents:[], //放置在绘图区域内的组件信息,包括edv_eui,roomis,floor_id,posx,poy

    /**存储配置的房间信息 */
    designRoomInfo:{'test':{}},  //  保存配置各个房间的信息，tem_high,...,以floor-room作为键值,在infoSetBox组件中被调用传参到registedInfo组件

    // backupComponents:[],// 用于“上一步”，下一步的中转变量存储
   
   /**右侧工具栏相关配置 */
    detialToolsBox:{
        show:0, //是否显示参数配置栏
        rangeType:'', //属于节点配置还是布局配置——NODE  LAYOUT
        tabId:null,
        nodeId:null,
        itemId:null, //记录存储在全局变量数组中的位置
        nodeType:null, //具体属于哪一类节点
    } ,//是否显示右侧参数配置工具箱

    previewClick:0, //初始关闭全屏预览，

    /**页面tab页页数 */
    layoutInfo:{
        title:'请键入一级标题',
        subtitle:'请键入二级标题',
        fireMusic:false,
        warnBox:{
            hasSet:0,

        }
    },
    /**保存每个页面节点信息 */
    pageTabs:{
        0:{
            name:'一楼',
            imgload:false,
            designComponents:[]
        }
    }

}
const getters = {

}
const actions = {
    /**将信息上传到服务器 */
    postToServer(context,obj){
        console.log('上传到服务器的用户名是：',obj)
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: '/config/save',
                data: {
                    username:obj.usr,
                    data:context.state
                }
              }).then(response=>{
                  console.log('后台返回的数据是',response) //response涵盖的内容是整个请求相关的参数
                  resolve(response.data)
              }).catch(e=>{
                  reject(e)
              })
          })
    },
    /**添加文件到服务器 */
    imgUpLoad(){
        console.log('点击背景添加图片')
    },
    delComponent(context, id) {
        //删除前备份一份
        // context.commit('setState', { backupComponents: JSON.parse(JSON.stringify(context.state.components)) })
        // let components = context.state.designComponents
        // return Promise.resolve(components)
    },
    

}
const mutations = {
    /**已注册过用户设计页面数据初始化 */
    initDesignState(state,obj){
        let keys=Object.keys(state)
        for(var key of keys){
            state[key]=obj[key]
        }
        console.log('初始化后页设计面的初始信息',state)
    },
    setState(state, obj) {
        // obj = mergeDeep(JSON.parse(JSON.stringify(state)), obj)
        Object.assign(state, obj)

        //保存本地
    },
    /** 保存新增的节点信息*/
    addNodes(state,obj){
        console.log('addNodeS被此次调用，传入的参数是',JSON.stringify(obj))
        let tabIndex=0
        if(obj.tabIndex){
            tabIndex=obj.tabIndex
        }
        if(!obj.id){//说明此处在拖拽节点
            Object.assign(obj,{
                id:state.pageTabs[tabIndex].designComponents.length
            })
            state.pageTabs[tabIndex].designComponents.push(obj)
        }else{ //说明在注册节点信息
            ////此处要先删除obj的id键值
            let targetId=obj.id
            delete obj.id
            Object.assign(state.pageTabs[tabIndex].designComponents[targetId],obj) 

            if(obj.floor_id){
                //如果是在节点信息配置时，将配置的'floor-room'作为键进行保存
                let key_name=obj.floor_id+'-'+obj.room_id
                if(!(key_name in state.designRoomInfo)){
                    // Object.assign(state.designRoomInfo,{[key_name]:{}})
                    state.designRoomInfo=Object.assign({},state.designRoomInfo,{[key_name]:{}})
                    console.log('进入房间信息存储，目前的designRoomInfo信息',state.designRoomInfo)
                }
            }
        }  
        
    },
    setRoomInfo(state,obj){
        let roomid=obj.room_id
        console.log('setRoomInfo被此次调用，传入的参数是',JSON.stringify(obj))
        // Object.assign(state.designRoomInfo[roomid],obj)
        state.designRoomInfo[roomid]=Object.assign({},state.designRoomInfo[roomid],obj) 
        console.log('当前'+roomid+'房间里的数据时：',state.designRoomInfo[roomid])
    },

    /** 信息配置框是否显示状态修改*/
    showToolsBoxChange(state,obj){
        console.log('传入的store中的detialToolsBox的obj',obj)
        Object.assign(state.detialToolsBox,obj)
        console.log('store中的detialToolsBox',state.detialToolsBox)
    },
    /**双向绑定tab页面标题 */
    updateTabName(state,obj){
        console.log('tab也名称修改传入参数',obj)
        state.pageTabs[obj.tabIndex]=Object.assign({},state.pageTabs[obj.tabIndex],obj)
        console.log('tab也名称修改后元素内容', state.pageTabs)
    },
    updateTitle(state,obj){
        console.log('updateTitle标题信息被改变，传入的参数是',obj)
        if(obj.name=='subtitle'){
            state.layoutInfo.subtitle=obj.titleText
        }else{
            state.layoutInfo.title=obj.titleText
        }
        console.log('layoutInfo信息被改变，修改后是',state.layoutInfo)

    },
    /**布局tab页修改*/
    updateLayout_tab(state,obj){
        let curLen=Object.keys(state.pageTabs).length
        if(obj.operate =='tab-icon-add'){
            
            let tabObj={
                [curLen]:{
                    name:curLen,
                    imgload:false,
                    designComponents:[]
                }
            }
            state.pageTabs=Object.assign({},state.pageTabs,tabObj) 
            console.log('增加属性后，当前pageTabs是',JSON.stringify(state.pageTabs))

        }else{
            delete state.pageTabs[Object.keys(state.pageTabs)[curLen-1]] //删除最后一个元素
            state.pageTabs=Object.assign({},state.pageTabs)  //避免不动态更新视图
            console.log('删除属性后，当前pageTabs是',JSON.stringify(state.pageTabs))
        }
    },
    /**上传文件后修改layout属性状态 */
    updateLayoutState(state,obj){
        console.log('上传文件好偶更新layout状态，上传的obj是',obj)
        if(obj.type == 'img'){
            state.pageTabs[obj.val].imgload=true
        }else if(obj.type == 'media'){
            state.layoutInfo.fireMusic=obj.val
        }else{
            state.layoutInfo=Object.assign({},state.layoutInfo,obj)
        }
    },

    /**
     *与后台数据传输相关 
     */
    /**接收mqtt传来信息，更新全局存储节点的变量 */
    updateNodesList(state,obj){
        console.log('接收，mqtt数据被调用，传入的数据是',obj)
        // state.pageTabs[obj.tab_id].designComponents=Object.assign({},state.pageTabs[obj.tab_id]) 
    }
}
export default {
    namespaced : true,
    state,
    getters,
    actions,
    mutations
}