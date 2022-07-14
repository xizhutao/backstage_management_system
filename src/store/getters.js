const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.name, // 建立用户名的快捷访问
  userId: state => state.user.userInfo.userId, // 建立用户id的快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto
}
export default getters
