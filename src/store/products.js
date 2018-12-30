import axios from 'axios';
import $ from 'jquery';

export default {
  namespaced: true,
  state: {
    products: [],
    tempProduct: {
      title: '[賣]動物園造型衣服3',
      category: '衣服2',
      origin_price: 100,
      price: 300,
      unit: '個',
      image: 'test.testtest',
      description: 'Sit down please 名設計師設計',
      content: '這是內容',
      is_enabled: 1,
      imageUrl: '',
    },
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
    updateProduct(context) {
      let api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/product`;
      let httpMethod = 'post';
      if (!context.state.isNew) {
        api = `${process.env.VUE_APP_API_PATH}/api/${
          process.env.VUE_APP_CUSTOM_PATH
        }/admin/product/${context.state.tempProduct.id}`;
        httpMethod = 'put';
      }
      axios[httpMethod](api, { data: context.state.tempProduct }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $('#productModal').modal('hide');
          context.dispatch('productsModule/getProducts', null, { root: true });
          if (context.state.isNew) {
            console.log('新增成功');
          } else {
            console.log('編輯成功');
          }
        } else {
          $('#productModal').modal('hide');
          context.dispatch('productsModule/getProducts', null, { root: true });
          if (context.state.isNew) {
            console.log('新增失敗');
          } else {
            console.log('編輯失敗');
          }
        }
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
