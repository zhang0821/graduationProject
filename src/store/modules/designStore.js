

import axios from 'axios'
const state = {
    
    components: [], //预览视图的组件树
    
    copiedComponents: [],//复制的组件

    currentComponent: {}, //预览视图的选中组件

    designComponents:[], //放置在绘图区域内的组件信息,包括edv_eui,roomis,floor_id,posx,poy

    designRoomInfo:{'pre':{}},  //  保存配置各个房间的信息，tem_high,...,以floor-room作为键值,在infoSetBox组件中被调用传参到registedInfo组件

    backupComponents:[],// 用于“上一步”，下一步的中转变量存储
    detialToolsBox:{
        show:0, //是否显示参数配置栏
        rangeType:'', //属于节点配置还是布局配置——NODE  LAYOUT
        itemId:null, //记录存储在全局变量数组中的位置
        nodeType:null, //具体属于哪一类节点
    } ,//是否显示右侧参数配置工具箱

    previewClick:0 //出事关闭全屏预览
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
    delComponent(context, id) {
        //删除前备份一份
        context.commit('setState', { backupComponents: JSON.parse(JSON.stringify(context.state.components)) })

        let components = context.state.designComponents

        let index = components.findIndex(c => c.info.id === id)
        let component = components[index] //找到要删除的元素
            //从父组件的slots中删除
            if (component.parentId) {
                let parent = components.find(c => c.info.id === component.parentId)
                let slot = parent.slots[component.slot || component.attributes.slot || 'default']
                let i = slot.findIndex(item => item.id === component.info.id)
                    //删除
                slot.splice(i, 1)

                //递归获取最父级组件
                let getTop = function(_component) {
                    if (_component.parentId) {
                        let c = components.find(c => c.info.id === _component.parentId)
                        return getTop(c)
                    } else {
                        return _component
                    }
                }

                //更新模板
                let top = getTop(parent)
                top.template = getTemplate(top.info, top.attributes, top.slots).template
            }
        //删除当前组件所有子组件
        function delChildren(component) {
            let slots = component.slots
            Object.keys(slots).forEach(slot => {
                if (component.slots[slot].length) {
                    component.slots[slot].forEach(val => {
                        let childIndex = components.findIndex(c => c.info.id === val.id)
                        let hasChild
                        if (childIndex >= 0)
                            hasChild = Object.keys(components[childIndex].slots).every(slot => {
                                return components[childIndex].slots[slot].length > 0
                            })
                        if (hasChild)
                            delChildren(components[childIndex])
                        components.splice(childIndex, 1)

                    })
                }
            })
        }
        delChildren(component)

        //删除自身
        index = components.findIndex(c => c.info.id === id) //components已被更新 重新获取索引
        components.splice(index, 1)

        //删除指定id元素后，更新索引后，重新更新信息数组
        context.commit('setState', { currentComponent: {}, components })

        return Promise.resolve(components)
    },
    

}
const mutations = {
    setState(state, obj) {
        // obj = mergeDeep(JSON.parse(JSON.stringify(state)), obj)
        Object.assign(state, obj)

        //保存本地
    },
    /** 保存新增的节点信息*/
    addNodes(state,obj){
        console.log('addNodeS被此次调用，传入的参数是',JSON.stringify(obj))
        if(!obj.id){//说明此处在拖拽节点
            Object.assign(obj,{
                id:state.designComponents.length
            })
            state.designComponents.push(obj)
        }else{ //说明在注册节点信息
            ////此处要先删除obj的id键值
            let targetId=obj.id
            delete obj.id
            Object.assign( state.designComponents[targetId],obj) 

            if(obj.floor_id){
                //如果是在节点信息配置时，将配置的'floor-room'作为键进行保存
                let key_name=obj.floor_id+'-'+obj.room_id
                if(!(key_name in state.designRoomInfo)){
                    Object.assign(state.designRoomInfo,{[key_name]:{}})
                    console.log('进入房间信息存储，目前的designRoomInfo信息',state.designRoomInfo)
                }
            }
        }  
        
    },
    setRoomInfo(state,obj){
        let roomid=obj.room_id
        console.log('setRoomInfo被此次调用，传入的参数是',JSON.stringify(obj))
        Object.assign(state.designRoomInfo[roomid],obj)
        console.log('当前'+roomid+'房间里的数据时：',state.designRoomInfo[roomid])


    },

    /** 信息配置框是否显示状态修改*/
    showToolsBoxChange(state,obj){
        console.log('传入的store中的detialToolsBox的obj',obj)
        Object.assign(state.detialToolsBox,obj)
        console.log('store中的detialToolsBox',state.detialToolsBox)
    },

    setInfoStore(){

    }
}
export default {
    namespaced : true,
    state,
    getters,
    actions,
    mutations
}