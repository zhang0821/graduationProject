import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)//将状态从根组件“注入”到每一个子组件中
export default new Vuex.Store({
	state: {
		count: 11111,
		socketMessage: ''
	},
	mutations:{
		increment(state){
			state.count++
		}
	},
	actions:{
		
	}
})

// export default new Vuex.Store({
// 	state: {
// 	  isConnected: false,
// 	  socketMessage: ''
// 	},
// 	actions:{
// 	  SOCKET_CONNECT(state) {
// 			console.log('vue连接成功服务器')
// 			state.isConnected = true;
// 	  },
  
// 	  SOCKET_DISCONNECT(state) {
// 			state.isConnected = false;
// 	  },
  
// 	  SOCKET_DEVMSG(state, message) {
// 			console.log('vue收到被服务器触发devMsg',message)
// 			state.socketMessage = message
// 	  }
// 	}
// })