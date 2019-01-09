import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login'
import Main from '@/page/Main'
import Design from '@/page/Design'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Main',
      name: 'Main',
      component:  Main
    },
    {
      path: '/Design',
      name: 'Design',
      component: Design
    }, 
    {
      path: '*',
      redirect: '/'
    }
  ]
})
