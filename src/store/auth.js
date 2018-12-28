import axios from 'axios';
import router from '../router';

export default {
  namespaced: true,
  state: {
    user: {
      username: '',
      password: '',
    },
  },
  actions: {
    signIn(context) {
      const api = `${process.env.VUE_APP_API_PATH}/admin/signin`;
      axios.post(api, context.state.user).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          router.push('/admin/products');
        }
      });
    },
    updateUserName(context, userName) {
      context.commit('USER_NAME', userName);
    },
    updatePassword(context, password) {
      context.commit('PASSWORD', password);
    },
  },
  mutations: {
    USER_NAME(state, userName) {
      state.user.username = userName;
    },
    PASSWORD(state, password) {
      state.user.password = password;
    },
  },
  getters: {
    username(state) {
      return state.user.username;
    },
    password(state) {
      return state.user.password;
    },
  },
};
