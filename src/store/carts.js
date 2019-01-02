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
    addToCart(context, { id, qty }) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_CUSTOM_PATH}/cart`;
      const cart = {
        product_id: id,
        qty,
      };

      context.dispatch('updateLoadingItem', id, { root: true });

      axios.post(api, { data: cart }).then(response => {
        if (response.data.success) {
          context.dispatch('updateLoadingItem', '', { root: true });
          context.dispatch('getCart');

          $('#productModal').modal('hide');
        }
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
