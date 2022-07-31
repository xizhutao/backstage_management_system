import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from '@/components/ScreenFull'
import SvgIcon from '@/components/SvgIcon'
import Lang from '@/components/Lang'
export default {
  install (Vue) {
    // 注册全局通用栏对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入图片上传组件
    Vue.component('ScreenFull', ScreenFull) // 注册导入图标上传组件
    Vue.component('SvgIcon', SvgIcon) // 注册导入图标上传组件
    Vue.component('Lang', Lang) // 注册导入图标上传组件
    Vue.use(Print) //注册打印插件
  }
}
