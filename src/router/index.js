import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import BookAdmin from '@/components/BookAdmin'
import BookList from '@/components/BookList'
import Login from '@/page/Login'
import Main from '@/page/Main'
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
      component: Main
    },
    {
      path: '/bookAdmin',
      name: 'BookAdmin',
      component: BookAdmin
    },
    {
      path: '/books',
      component: BookList,
    },
  ]
})
