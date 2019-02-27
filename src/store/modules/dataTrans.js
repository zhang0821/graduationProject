import data from '@/utils/jsondata'
import axios from 'axios'

const state = {
    audio:null,
    /**存储页面报警信息 */
    warnInfo:[],
    smokeWarn:[],
    listenChange:0,
    curWarnTab:'0', //页面定个在哪一个tab页,默认0
    nodeInfo:data,
    username:'',
    allComponents:{}
}
const getters = {

}
const actions = {
    basicNodesInfo(context,obj){
        console.log('basicNodesInfo传入的数据',obj)
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: '/pageInit/nodes',
                data: {
                    username:obj.usr
                }
              }).then(response=>{
                  console.log('后台返回的数据是',response) //response涵盖的内容是整个请求相关的参数
                  context.state.nodeInfo=response.data.designComponents
                  resolve(response.data.designComponents) //返回所有注册节点信息
              }).catch(e=>{
                  reject(e)
              })
          })

    }
}
const mutations = {
    mqttUpdateNodeState(state,obj){
        state.listenChange++
        console.log('dataTrans中接收到mqtt消息更新',obj) 
        //异常的加入报警框，不异常的，查询是否在warninfo内，在的话，移除
        if(obj.status == 0 ){
            state.warnInfo.push(obj)
            if(obj.type == 'smoke'){
                state.smokeWarn.push(obj.dev_eui)
                state.audio='play'
                state.curWarnTab=obj.tabIndex//tab页展示时
            }
        }else{
            let nodes=state.warnInfo
            for(let i=0;i<nodes.length;i++){
                console.log('当前遍历的节点是',nodes[i].dev_eui)
                if(nodes[i].dev_eui == obj.dev_eui){
                    state.warnInfo.splice(i,1)
                    //如果这个是烟雾节点，则也在smokeWarn中删除它
                    let index=state.smokeWarn.indexOf(obj.dev_eui)
                    if(index > -1){
                        state.smokeWarn.splice(index,1)
                    }
                    if(state.smokeWarn.length <1){
                        state.audio=null
                    }
                    console.log('删除后warnInfo数组是',state.warnInfo)
                    console.log('删除后smokeWarn数组是',state.smokeWarn)
                    break
                }
            }
        }

    },
    updateInfo(state,newInfo){ 
        console.log('mqtt传入更新新节点',newInfo)//载荷可以是一个对象
        
        state.nodeInfo.push(newInfo)        
    },
    setUserName(state,name){
        state.username=name
    },
    setAllComponets(state,dataObj){
        state.allComponents=dataObj
        console.log('展示所有组件信息',state.allComponents)
    },
}
export default {
    namespaced : true,
    state,
    getters,
    actions,
    mutations
}