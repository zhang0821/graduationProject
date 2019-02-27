// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueClip from 'vue-clip'
import App from './App'
import router from './router'
import store from './store/index'
import VueResource from 'vue-resource'
import 'bootstrap/dist/css/bootstrap.css'
import 'vue-contextmenu/style/css/font-awesome.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import md5 from "js-md5" //MD5加密组件
import { JSEncrypt } from 'jsencrypt' //RSA加密
import VueContextMenu  from 'vue-contextmenu' //右键菜单组件
Vue.use(VueContextMenu)
// import * as socketio from 'socket.io-client'
// import * as VueSocketIO from 'vue-socket.io'
// export const SocketInstance = socketio('ws://localhost:8080/infos');
// Vue.use(VueSocketIO, SocketInstance,store)
Vue.use(VueClip)
Vue.use(VueResource)

//全局挂载MD5加密方法,在组件中使用this.$md5('')
Vue.prototype.$md5=md5
//定义全局挂载RSA加密方法,注意：参数传递的+号处理，在传输时会把+变成空格，不处理后端就报错了。
Vue.prototype.$getCode = function(encryptData){
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey('sjsjssbcjs/skss+skshsgsil')//后台给的公钥，可以第一登陆后，保存后台给的公钥。
  let data=encrypt.encrypt(encryptData)
  return data
}


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
