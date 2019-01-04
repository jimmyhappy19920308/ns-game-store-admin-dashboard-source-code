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
          const { message } = response.data;
          const status = 'success';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          context.dispatch('updateLoadingItem', '', { root: true });
          context.dispatch('getCart');

          $('#productModal').modal('hide');
        }
      });
    },
    removeCart(context, id) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/cart/${id}`;

      context.dispatch('updateLoading', true, { root: true });

      axios.delete(api).then(response => {
        if (response.data.success) {
          const { message } = response.data;
          const status = 'success';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          context.dispatch('getCart');
          context.dispatch('updateLoading', false, { root: true });
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
