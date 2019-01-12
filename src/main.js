// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueClip from 'vue-clip'
import App from './App'
import router from './router'
import store from './store/index'
import VueResource from 'vue-resource'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

// import * as socketio from 'socket.io-client'
// import * as VueSocketIO from 'vue-socket.io'
// export const SocketInstance = socketio('ws://localhost:8080/infos');
// Vue.use(VueSocketIO, SocketInstance,store)
Vue.use(VueClip)
Vue.use(VueResource)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
