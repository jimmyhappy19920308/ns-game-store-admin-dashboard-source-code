import axios from 'axios';
import router from '../router';

export default {
  namespaced: true,
  state: {
    user: {
      username: '',
      password: '',
    },
    errorMessage: '',
  },
  actions: {
    signIn(context) {
      const api = `${process.env.VUE_APP_API_PATH}/admin/signin`;

      axios.post(api, context.state.user).then(response => {
        if (response.data.success) {
          router.push('/admin/products');
        } else {
          context.commit('ERROR_MESSAGE', response.data.message);
        }
      });
    },
    signOut() {
      const api = `${process.env.VUE_APP_API_PATH}/logout`;
      axios.post(api).then(response => {
        if (response.data.success) {
          router.push('/login');
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
    ERROR_MESSAGE(state, errorMessage) {
      state.errorMessage = errorMessage;
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
