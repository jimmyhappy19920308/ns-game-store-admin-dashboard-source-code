import axios from 'axios';
import $ from 'jquery';

export default {
  namespaced: true,
  state: {
    products: [],
    tempProduct: {},
    pagination: {},
    isNew: false,
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
    productModal(context, { isNew, item }) {
      if (isNew) {
        context.commit('TEMP_PRODUCT', {});
        context.commit('IS_NEW', true);
      } else {
        context.commit('TEMP_PRODUCT', Object.assign({}, item));
        context.commit('IS_NEW', false);
      }

      $('#productModal').modal('show');
    },
    delProductModal(context, item) {
      context.commit('TEMP_PRODUCT', Object.assign({}, item));

      $('#delProductModal').modal('show');
    },
  },
  mutations: {
    PRODUCTS(state, products) {
      state.products = products;
    },
    PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    TEMP_PRODUCT(state, tempProduct) {
      state.tempProduct = tempProduct;
    },
    IS_NEW(state, isNew) {
      state.isNew = isNew;
    },
  },
  getters: {
    products(state) {
      return state.products;
    },
    pagination(state) {
      return state.pagination;
    },
    tempProduct(state) {
      return state.tempProduct;
    },
    isNew(state) {
      return state.isNew;
    },
  },
};
