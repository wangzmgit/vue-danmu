import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',
    userInfo:[],
  },
  mutations: {
    setToken(state,token) {
      Cookies.set('token',token,{ expires: 14 })
      state.token=token
    },
    setUserInfo(state,userInfo){
      Cookies.set('userInfo',userInfo,{ expires: 14 })
      state.userInfo=userInfo
    }
  },
  actions: {
    setToken(context,token) {
      context.commit('setToken', token)
    },
    setUserInfo(context,userInfo) {
      context.commit('setUserInfo',userInfo)
    }
  },
  modules: {
  }
})
