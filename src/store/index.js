import Vue from 'vue'
import Vuex from 'vuex'
// import data from '../components/jsondata'
import dataTrans from './modules/dataTrans'
import designStore from './modules/designStore'


Vue.use(Vuex)//将状态从根组件“注入”到每一个子组件中
export default new Vuex.Store({
	modules : {
		dataTrans, //数据展示主页面节点数据相关
		designStore
	}
	
})