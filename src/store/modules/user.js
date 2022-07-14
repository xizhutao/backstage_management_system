import { getToken, setToken, removeToken } from '@/utils/auth'
import { handlelogin } from '@/api/user'
import { Message } from 'element-ui'
// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  token: getToken() // 设置token初始状态   token持久化 => 放到缓存中
}
const mutations = {
  // 设置token
  setToken (state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken (state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  }
}
const actions = {
  // 登录
  async login ({ commit }, data) {
    console.log(data)
    const res = await handlelogin(data)
    commit('setToken', res)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

