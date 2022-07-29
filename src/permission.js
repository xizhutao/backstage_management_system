import router from './router'
import store from '@/store'
// 引入进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  nprogress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 如果用户不存在就就分发获取用户信息的action
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getInfo')
        // 分发筛选用户权限的action
        const filterRoutes = await store.dispatch('permission/filterRoutes', roles.menus)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path) //addRouter必须配合此代码使用
      }
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
