import { constantRoutes, asyncRoutes } from "@/router"
const state = {
  routes: constantRoutes
}
const actions = {
  filterRoutes ({ commit }, menus) {
    const routes = []
    console.log('menus' ,menus);
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    });
    commit('setRoutes', routes)
    return routes
  }
}
const mutations = {
  // 修改路由权限
  setRoutes (state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}