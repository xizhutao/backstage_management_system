import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 全局样式
import '@/styles/index.scss' // global css
import i18n from '@/lang/index'
import App from './App'
import store from './store'
import router from './router'
import checkPermission from '@/mixins/checkPermission'
import '@/icons' // icon
import '@/permission' // permission control //权限控制
import * as directives from '@/directives'
import * as filters from '@/filters'
import Component from '@/components'
Vue.mixin(checkPermission) // 注册全局的混入
Vue.filter('getDay', (value) => {
  const day = value.split('-')[2]
  return day.startsWith('0') ? day.substr(1) : day
})
Vue.use(Component) // 注册自己的插件
Object.keys(directives).forEach(item => {
  Vue.directive(item, directives[item])
})
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
// 设置element为当前的语言
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
