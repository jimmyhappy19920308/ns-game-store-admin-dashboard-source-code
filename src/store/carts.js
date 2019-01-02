import axios from 'axios';
import $ from 'jquery';

export default {
  namespaced: true,
  state: {
    cart: {},
  },
  actions: {
    getCart(context) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart`;
      axios.get(api).then(response => {
        if (response.data.success) {
          context.commit('CART', response.data.data);
        }
        // console.log(vm.products);
      });
    },
  },
  mutations: {
    CART(state, cart) {
      state.cart = cart;
    },
  },
  getters: {
    cart(state) {
      return state.cart;
    },
  },
};
