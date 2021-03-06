import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store'
import VueLazyload from 'vue-lazyload'

//加载mockSerrver.js模块
import './mock/mockServer'
import Split from './components/Split/Split'

// VueLazyload图片懒加载配置
import loading from './assets/loading.gif'

Vue.use(VueLazyload, {
  // loading: './src/assets/loading.gif'
  loading
})

Vue.config.productionTip = false

//注册成为全局的Split标签组件  可以直接使用  <Split/>
Vue.component('Split', Split)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
