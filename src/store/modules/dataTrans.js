import data from '@/utils/jsondata'

const state = {
    nodeInfo:data,
    testArr:['hello']
}
const getters = {

}
const actions = {
    /**测试函数 */
    testmyaction({ commit }){
        console.log('测试action中函数')
        setTimeout(() => {
            commit('increment')
        }, 1000)
    }
}
const mutations = {
    increment(state){
        state.testArr.push('这是action测试加入的信息')
    },
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