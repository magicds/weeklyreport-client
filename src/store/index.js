import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userData: {}
  },
  mutations: {
    updateUserData(state, { data }) {
      if (!data) {
        state.userData = {};
      } else {
        Object.keys(data).forEach(k => {
          state.userData[k] = data[k];
        });
      }
    }
  },
  actions: {},
  modules: {}
});
