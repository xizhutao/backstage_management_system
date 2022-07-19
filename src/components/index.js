import PageTools from '@/components/PageTools'
export default {
  install (Vue) {
    // 注册全局通用栏对象
    Vue.component('PageTools', PageTools)
  }
}
