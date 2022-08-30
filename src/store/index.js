import { createStore } from 'vuex'

export default createStore({
  state: {
    userObj: { is_success: false, user: { type: '', wechat_mp_id: '', subject_bp: '', headimgurl: '', bp: 0, wechat_mp_bind: false, rule_order: false, isupdate_password: true, admin: false, username: '', image_name: '', email: '' } },
  },
  mutations: {
    set_userObj(state, data) {
      state.userObj = data
    },
    clear_userObj(state) {
      state.userObj = { is_success: false, user: { type: '', wechat_mp_id: '', subject_bp: '', headimgurl: '', bp: 0, wechat_mp_bind: false, rule_order: false, isupdate_password: true, admin: false, username: '', image_name: '', email: '' } }
    }
  },
  actions: {
    someAsyncTask({ commit }) {
      commit('set_userObj')
      commit('clear_userObj')
    }
  },
  modules: {
  }
})
