import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant全局配置
import '@/utils/vant-ui'
// 导入common.less
import '@/style/common.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 捕获全局未处理的 Promise 错误
window.addEventListener('unhandledrejection', event => {
  console.error('全局未捕获的拒绝:', event.reason)
})

//将router错误输出到控制台
// router.onError(error => {
//   console.error(error)
// })
