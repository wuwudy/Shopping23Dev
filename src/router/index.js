import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Search from '@/views/search/search'
import SearchList from '@/views/search/searchList'
import Pay from '@/views/pay'
import Myorder from '@/views/myorder'
import Prodetail from '@/views/prodetail'
import Layout from '@/views/layout'
import Address from '@/views/address'
import AddressEditAdd from '@/views/address/edit_add.vue'
import Comment from '@/views/comment'

import Home from '@/views/layout/home'
import Categroy from '@/views/layout/categroy'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      { path: '/home', component: Home },
      { path: '/categroy', component: Categroy },
      { path: '/cart', component: Cart },
      { path: '/user', component: User }
    ]
  },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/searchList', component: SearchList },
  { path: '/pay', component: Pay },
  { path: '/prodetail/:id', component: Prodetail },
  { path: '/myorder/:dataType', component: Myorder },
  { path: '/address', component: Address },
  { path: '/addressEditAdd', component: AddressEditAdd },
  { path: '/comment/:id', component: Comment }
]

const router = new VueRouter({
  routes
})

//定义一个数组，存储需要权限才能访问的路由
const authUrls = ['/pay', '/myorder', '/cart']

router.beforeEach((to, from, next) => {
  console.log(from, to)

  //如果不是权限路由，直接放行
  if (!authUrls.includes(to.path)) {
    next()
    return
  }
  //是权限路由，看是否有token
  const token = store.getters.token
  if (token) {
    next()
    return
  } else {
    // 重定向到登录页面
    next(`/login?forwardUrl=${to.path}`)
  }
})

//对router原型链上的push方法重写，因为vue-router v3.1.0之后，push replace方法都会返回一个promise
//若push跳转被守卫拦截，没有对这个未解决promise进行捕获，会报uncaught 错误
//通过重写push的办法返回一个已解决的promise
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  // 如果传递了回调函数，直接调用原始的 push 方法
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  // 否则，在捕获错误后返回一个已解决的 Promise
  return originalPush.call(this, location).catch(err => err)
}

export default router
