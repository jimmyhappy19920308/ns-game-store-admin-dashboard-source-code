import Vue from 'vue';
import Vuex from 'vuex';
import productsModule from './products';
import authModule from './auth';
import ordersModule from './orders';
import couponsModule from './coupons';
import cartsModule from './carts';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false,
    status: {
      loadingItem: '',
    },
  },
  actions: {
    updateLoading(context, payload) {
      context.commit('LOADING', payload);
    },
    updateLoadingItem(context, payload) {
      context.commit('LOADING_ITEM', payload);
    },
  },
  mutations: {
    LOADING(state, payload) {
      state.isLoading = payload;
    },
    LOADING_ITEM(state, payload) {
      state.status.loadingItem = payload;
    },
  },
  getters: {
    isLoading(state) {
      return state.isLoading;
    },
    status(state) {
      return state.status;
    },
  },
  modules: {
    productsModule,
    authModule,
    ordersModule,
    couponsModule,
    cartsModule,
  },
});
