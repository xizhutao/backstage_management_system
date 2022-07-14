import router from './router'
import store from '@/store'
// 引入进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  nprogress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    console.log(whiteList.indexOf(to.path))
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  // 关闭进度条
  nprogress.done()
})

// 后置路由守卫
router.afterEach(() => {
  // 关闭进度条
  nprogress.done()
})
