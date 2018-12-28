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
  },
};
