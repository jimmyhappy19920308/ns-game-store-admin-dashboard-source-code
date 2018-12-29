import axios from 'axios';
import $ from 'jquery';

export default {
  namespaced: true,
  state: {
    products: [],
    tempProduct: {},
    pagination: {},
  },
  actions: {
    getProducts(context, page) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/products?page=${page}`;

      context.dispatch('updateLoading', true, { root: true });

      axios.get(api).then(response => {
        context.commit('PRODUCTS', response.data.products);
        context.commit('PAGINATION', response.data.pagination);
        context.dispatch('updateLoading', false, { root: true });
      });
    },
  },
  mutations: {
    PRODUCTS(state, products) {
      state.products = products;
    },
    PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
  },
  getters: {
    products(state) {
      return state.products;
    },
    pagination(state) {
      return state.pagination;
    },
  },
};
