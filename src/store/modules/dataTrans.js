import data from '@/utils/jsondata'
import axios from 'axios'

const state = {
    nodeInfo:data,
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
    updateInfo(state,newInfo){ 
        console.log('mqtt传入更新新节点',newInfo)//载荷可以是一个对象
        state.nodeInfo.push(newInfo)        
    },
}
export default {
    namespaced : true,
    state,
    getters,
    actions,
    mutations
}