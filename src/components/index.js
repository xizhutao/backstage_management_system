import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
export default {
  install (Vue) {
    // 注册全局通用栏对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
  }
}
