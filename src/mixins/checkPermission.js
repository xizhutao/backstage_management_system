import store from "@/store";
export default {
  methods: {
    checkPermission (key) {
      if (store.state.user.userInfo.roles.points && store.state.user.userInfo.roles.points) {
        const { roles } = store.state.user.userInfo
        return roles.points.some(item => item === key)
      }
      return false
    }
  },
}