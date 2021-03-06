

import axios from 'axios'
import Vue from 'vue'
import { setTimeout, setInterval, clearInterval } from 'timers'
import designTrans from './dataTrans'
const state = {
    // components: [], //预览视图的组件树

    /**存储节点信息 */
    // designComponents:[], //放置在绘图区域内的组件信息,包括edv_eui,roomis,floor_id,posx,poy

    /**存储配置的房间信息 */
    designRoomInfo:{},  //  保存配置各个房间的信息，tem_high,...,以floor-room作为键值,在infoSetBox组件中被调用传参到registedInfo组件

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
        layoutConTopHeight:50,
        layoutConBottomHeight:50,
        fireMusic:false,
        offlineTimer1:60,
        offlineTimer2:300, //60*5
        // warnBox:{}
        // warnBox:{
        //     hasSet:0,
        // }
    },
    
    /**保存每个页面节点信息 */
    pageTabs:{
        // 0:{
        //     name:'默认',
        //     imgload:false,
        //     designComponents:[],
        //     table:{
        //         hasSet:false
        //     }
        // }
    }

    

}
const getters = {

}
const actions = {
    /**将信息上传到服务器 */
    validInfo(context){
        return new Promise((resolve, reject)=>{
            if(!context.state.layoutInfo.fireMusic){
                alert('请添加告警音乐！')
                resolve(false)
            }
            if(Object.keys(context.state.pageTabs).length){
                for(let i=0;i<Object.keys(context.state.pageTabs).length;i++){
                    if(!context.state.pageTabs[i].imgload){
                        alert('请为tab也添加布局图片！')
                        resolve(false)
                        break
                    }
                }
            }
            resolve(true)
        })
       
    },    
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
                  resolve(response.data) //会返回已经存在的节点，即，节点的唯一标识号是唯一的
              }).catch(e=>{
                  reject(e)
              })
          })
    },
    /**添加文件到服务器 */
    imgUpLoad(){
        console.log('点击背景添加图片')
    },
    //公用的dragstart函数
    
}
const mutations = {
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
    /**修改节点在页面的位置 */
    undateNodesPos(state,obj){
        state.pageTabs[obj.tabId].designComponents[obj.itemId].posx=obj.posx
        state.pageTabs[obj.tabId].designComponents[obj.itemId].posy=obj.posy
        console.log('修改节点的位置信息，obj',obj)
    },
    /**修改tabi页是否有表格 */
    updateTable(state,index){
        if(state.pageTabs[index]){
            console.log('index:',state.pageTabs[index])
            if(index!=null){
                state.pageTabs[index].table.hasSet=true
            }else{
                state.pageTabs[index].table.hasSet=false
            }
        }
    },
    /**删除页面节点 */
    deleteItem(state,obj){
        console.log('删除元素，传入的obj类型是',typeof obj)
        if(typeof obj !='object'){
            if(obj == 'warnBox'){
                delete state.layoutInfo.warnBox
                // state.layoutInfo.warnBox.hasSet=0
            }
        }else{
            console.log('传入要删除的元素信息是',obj.tabIndex,'id:',obj.id)
            console.log(state.pageTabs[obj.tabIndex].designComponents[obj.id])
            state.pageTabs[obj.tabIndex].designComponents.splice(obj.id,1)
            console.log('删除一个元素后剩余数组',state.pageTabs[obj.tabIndex].designComponents)
            //修改后面元素的id
            for(let i=obj.id;i<state.pageTabs[obj.tabIndex].designComponents.length;i++){
                state.pageTabs[obj.tabIndex].designComponents[i].id=i
            }
            //同时，如果后台已注册，需要发送请求到后台同步删除。
        }
        
    },
    /**还原设计页面数据 */
    emptyState(state){
        state.designRoomInfo={'test':{}},
        state.detialToolsBox={
            show:0,  
            rangeType:'',  
            tabId:null,
            nodeId:null,
            itemId:null,  
            nodeType:null, 
        } , 
        state.previewClick=0, 
        state.layoutInfo={
            layoutConTopHeight:50,
            layoutConBottomHeight:50,
            fireMusic:false,
            offlineTimer1:60,
            offlineTimer2:600, //60*10
            // warnBox:{
            //     hasSet:0,
            // }
        },
        state.pageTabs={
            0:{
                name:'默认',
                imgload:false,
                designComponents:[],
                table:{
                    hasSet:false
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
    updateLayoutCon(state,obj){
        let curLen=Object.keys(state.pageTabs).length
        if(obj.operate =='tab-icon-add' || obj.operate =='tab-icon-del'){
            if(obj.operate =='tab-icon-add'){
                let tabObj={
                    [curLen]:{
                        name:curLen,
                        imgload:false,
                        designComponents:[],
                        table:{
                            hasSet:false
                        }
                    }
                }
                state.pageTabs=Object.assign({},state.pageTabs,tabObj) 
                // console.log('增加属性后，当前pageTabs是',JSON.stringify(state.pageTabs))
    
            }else{
                delete state.pageTabs[Object.keys(state.pageTabs)[curLen-1]] //删除最后一个元素
                state.pageTabs=Object.assign({},state.pageTabs)  //避免不动态更新视图
                // console.log('删除属性后，当前pageTabs是',JSON.stringify(state.pageTabs))
            }
        }
        if(obj.operate == 'header_add' &&  state.layoutInfo.layoutConTopHeight==0){
            state.layoutInfo.layoutConTopHeight=50
        }
        if(obj.operate == 'footer_add' &&  state.layoutInfo.layoutConBottomHeight==0){
            state.layoutInfo.layoutConBottomHeight=50
        }
        
    },
    /**通用组件保存及资源上传 */
    updateLayoutState(state,obj){
        if(obj.type == 'img'){
            state.pageTabs[obj.val].imgload=true
        }else if(obj.type == 'media'){
            state.layoutInfo.fireMusic=obj.val
        }else{
            state.layoutInfo=Object.assign({},state.layoutInfo,obj) //第一次增加组件//objcet.assign无法实现深拷贝 //此处下一合并，键值会有丢失
            console.log('修改后当前layoutInfo值为',state.layoutInfo)
        }
    },
    /**删除通用组件 */
    delLayoutState(state,name){
        console.log('进入组件删除函数：',name)
        state.layoutInfo[name]=null
        delete state.layoutInfo[name]
        console.log('删除组件后layout内容是：',state.layoutInfo)
    },
    /**delLayoutCon删除 */
    delLayoutConTop(state){
        // console.log('要删除的layoutConTopHeight')
        state.layoutInfo.layoutConTopHeight = 0
    },
    delLayoutConBottom(state){
        // console.log('要删除的delLayoutConBottom')
        state.layoutInfo.layoutConBottomHeight = 0


    },
    modifyLConStyle(state,obj){
        console.log('修改TOP和BOTTOM尺寸,传入的数据是：',obj)
        let whichone=obj.type+'Height'
        state.layoutInfo[whichone]=obj.h
        console.log('此时修改后的layout值是：,',state.layoutInfo[whichone],state.layoutInfo)
    },
    /**
     *与后台数据传输相关 
     */
    /**初始化页面之前配置信息 */
    initSavedInfos(state,obj){
        console.log('接收页面初始化传入的数据是',obj)
        state.designRoomInfo=obj.designRoomInfo
        state.layoutInfo=obj.layoutInfo
        state.pageTabs=obj.pageTabs
        state.previewClick=obj.previewClick
    },
    /**接收mqtt传来信息，更新全局存储节点的变量 */
    updateNodesList(state,obj){
        console.log('designStore接收mqtt数据被调用,数据是obj.tabIndex:',obj.tabIndex,'obj.nodeIndex:',obj.nodeIndex)
        
        state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['status']=obj.status
        
        //如果是温湿度节点，要给该节点新增温湿度值
        if(obj.type == 'tem_hum'){
            state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['temp_value']=obj.temp_value
            state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['humi_value']=obj.humi_value
            // if( state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex].temp_value){
            //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex].temp_value=obj.temp_value
            //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex].humi_value=obj.humi_value
            // }else{
            //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['temp_value']=obj.temp_value
            //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['humi_value']=obj.humi_value
            // }
        }
        if(obj.type == 'air'){
            state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['nh4']=obj.nh4
            state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['h2s']=obj.h2s
            // if( state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex].nh4){
            //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex].nh4=obj.nh4
            //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex].h2s=obj.h2s
            // }else{
            //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['nh4']=obj.nh4
            //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['h2s']=obj.h2s
            // }
        }
        // this.commit('monitorNodesState',obj)

        // console.log('当前要被改变的节点的状态值是',state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex].status)

        //获取统计vuex中数据
          console.log('designTrans中的报警信息是',designTrans.state.warnInfo)
         //设定定时器，转化为离线状态，若离线，则也要加入报警框提醒中
         console.log('目前该元素的timer是：',state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer'])
        
         if( state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer']){
             clearTimeout(state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer'])
         }

         let timeOutTimer=setTimeout(()=>{
            state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['status']=null
            console.log(state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]+'的状态值在designTrans中清零')
        },state.layoutInfo.offlineTimer1*1000)
        
         if(obj.type == 'smoke'){
            timeOutTimer=setTimeout(()=>{
                state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['status']=null
                console.log(state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]+'编号的烟雾节点状态值在designTrans中清零')
            },state.layoutInfo.offlineTimer2*1000)
         }
         console.log(state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]+'编号的节点在designTrans中设置了定时器',state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer'])        
         state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer']=timeOutTimer
         console.log('designStore中接收完mqtt数据后，该节点的所有值是',state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex])
        
    },
    /**节点状态变更处理函数 */
    monitorNodesState(state,obj){
        console.log('进入函数monitorNodesState')
        //设定定时器，转化为离线状态，若离线，则也要加入报警框提醒中
        console.log('目前该元素的timer是：',state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer'])
        if( state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer']){
            clearTimeout(state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer'])
        }
        // let timeOutTimer=setTimeout(()=>{
        //     state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['status']=null
        // },30*1000)        
        // state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer']=timeOutTimer
        if(obj.type == 'smoke'){
            state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer']=setTimeout(()=>{
                state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['status']=null
            },state.layoutInfo.offlineTimer2*1000)
        }else{
            state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer']=setTimeout(()=>{
                state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['status']=null
            },state.layoutInfo.offlineTimer1*1000)
        }

        console.log('节点状态变更处理函数中打印，下一步该元素的timer是：',state.pageTabs[obj.tabIndex].designComponents[obj.nodeIndex]['timer'])

    }
}
export default {
    namespaced : true,
    state,
    getters,
    actions,
    mutations
}