import axios from 'axios';
import $ from 'jquery';
import router from '../router';

export default {
  namespaced: true,
  state: {
    pagination: {},
    orders: [
      {
        create_at: 154343432,
        id: '',
        is_paid: false,
        message: '',
        paid_date: 1523539924,
        payment_method: '',
        products: [
          {
            id: '',
            product_id: '',
            qty: '3',
            product: {
              title: '',
              unit: '',
            },
          },
        ],
        total: 100,
        user: {
          address: '',
          email: '',
          name: '',
          tel: '',
        },
        num: 1,
      },
    ],
    tempOrder: {
      create_at: 154343432,
      id: '',
      is_paid: false,
      message: '',
      paid_date: 1523539924,
      payment_method: '',
      products: [
        {
          id: '',
          product_id: '',
          qty: '3',
          product: {
            title: '',
            unit: '',
          },
        },
      ],
      total: 100,
      user: {
        address: '',
        email: '',
        name: '',
        tel: '',
      },
      num: 1,
    },
    newDate: 0,
  },
  actions: {
    getOrders(context, page) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/orders?page=${page}`;

      context.dispatch('updateLoading', true, { root: true });

      axios.get(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          context.commit('ORDERS', response.data.orders.filter(order => !order.isRemove));
          context.commit('PAGINATION', response.data.pagination);
          context.dispatch('updateLoading', false, { root: true });
        } else {
          context.dispatch('updateLoading', false, { root: true });
          console.log(response.data.message);
        }
      });
    },
    editOrderModal(context, item) {
      $('#orderModal').modal('show');

      context.commit('TEMP_ORDER', Object.assign({}, item));
      const dates = new Date(context.state.tempOrder.create_at * 1000);
      const year = dates.getFullYear();
      let month = dates.getMonth() + 1;
      let date = dates.getDate();

      context.commit('TOTAL', parseInt(context.state.tempOrder.total, 10));

      if (month < 10) {
        month = `0${month}`;
      }

      if (date < 10) {
        date = `0${date}`;
      }

      context.commit('NEW_DATE', `${year}-${month}-${date}`);
    },
    delOrderModal(context, item) {
      context.commit('DELETE_TEMP_ORDER', Object.assign({}, item));

      $('#delOrderModal').modal('show');
    },
    removeOrder(context) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/order/${context.state.tempOrder.id}`;

      context.dispatch('updateLoading', true, { root: true });

      const removeOrder = {
        tempOrder: context.state.tempOrder,
        isRemove: true,
      };
      axios.put(api, { data: removeOrder }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          context.dispatch('updateLoading', false, { root: true });

          $('#delOrderModal').modal('hide');

          context.dispatch('getOrders');

          console.log('訂單刪除成功');
        } else {
          context.dispatch('updateLoading', false, { root: true });

          $('#delOrderModal').modal('hide');

          context.dispatch('getOrders');

          console.log(response.data.message);
        }
      });
    },
    updateOrder(context) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/order/${context.state.tempOrder.id}`;

      const date = Math.round(new Date(context.state.newDate).getTime() / 1000);

      context.commit('CREATE_AT', date);

      context.dispatch('updateLoading', true, { root: true });

      axios.put(api, { data: context.state.tempOrder }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $('#orderModal').modal('hide');

          context.dispatch('getOrders');

          context.dispatch('updateLoading', false, { root: true });
        } else {
          $('#orderModal').modal('hide');

          context.dispatch('getOrders');

          context.dispatch('updateLoading', false, { root: true });

          console.log(response.data.message);
        }
      });
    },
  },
  mutations: {
    ORDERS(state, orders) {
      state.orders = orders;
    },
    PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    TEMP_ORDER(state, tempOrder) {
      state.tempOrder = tempOrder;
    },
    DELETE_TEMP_ORDER(state, tempOrder) {
      state.tempOrder = tempOrder;
    },
    TOTAL(state, total) {
      state.tempOrder.total = total;
    },
    NEW_DATE(state, newDate) {
      state.newDate = newDate;
    },
    CREATE_AT(state, createAt) {
      state.tempOrder.create_at = createAt;
    },
    EMAIL(state, email) {
      state.tempOrder.user.email = email;
    },
    PRODUCTS(state, products) {
      state.tempOrder.products = products;
    },
    UPDATE_TITLE(state, { index, value }) {
      state.tempOrder.products[index].product.title = value;
    },
    UPDATE_QTY(state, { index, value }) {
      state.tempOrder.products[index].qty = value;
    },
    UPDATE_UNIT(state, { index, value }) {
      state.tempOrder.products[index].product.unit = value;
    },
    IS_PAID(state, isPaid) {
      state.tempOrder.is_paid = isPaid;
    },
  },
  getters: {
    orders(state) {
      return state.orders;
    },
    tempOrder(state) {
      return state.tempOrder;
    },
    newDate(state) {
      return state.newDate;
    },
    pagination(state) {
      return state.pagination;
    },
    products(state) {
      return state.tempOrder.products;
    },
  },
};
