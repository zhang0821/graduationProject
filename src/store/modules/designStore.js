
const state = {
    
    components: [], //预览视图的组件树
    
    copiedComponents: [],//复制的组件

    currentComponent: {}, //预览视图的选中组件

    designComponents:[], //放置在绘图区域内的组件信息,包括edv_eui,roomis,floor_id,posx,poy

    designRoomInfo:{},  //  保存配置各个房间的信息，tem_high,...,以floor-room作为键值,在infoSetBox组件中被调用传参到registedInfo组件

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
    }
}
const mutations = {
    setState(state, obj) {
        // obj = mergeDeep(JSON.parse(JSON.stringify(state)), obj)
        Object.assign(state, obj)

        //保存本地
        localStorage.store = JSON.stringify(state)
    },
    /** 保存新增的节点信息*/
    addNodes(state,obj){
        console.log('此次调用addNodeS传入的参数是',JSON.stringify(obj))
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
                //如果是在节点信息配置时，将配置的floor-room进行保存
                let key_name=obj.floor_id+'-'+obj.room_id
                if(!(key_name in state.designRoomInfo)){
                    Object.assign(state.designRoomInfo,{[key_name]:{}})
                    console.log('进入房间信息存储，目前的designRoomInfo信息',state.designRoomInfo)
                }
            }
        }

        console.log('此次调用addNodes后，参量信息：')
        console.log('designComponents长度是：',state.designComponents.length,'具体信息是',JSON.stringify(state.designComponents))
        console.log('目前的designRoomInfo长度是',Object.keys(state.designRoomInfo).length,'具体信息是',state.designRoomInfo)
        
        
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