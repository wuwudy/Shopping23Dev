import { setInfo, getInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state() {
    return {
      userInfo: getInfo()
    }
  },
  mutations: {
    //设置个人信息
    setUserInfo(state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    logout(context) {
      context.commit('setUserInfo', {})
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {}
}
