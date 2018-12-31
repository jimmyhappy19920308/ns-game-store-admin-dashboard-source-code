import axios from 'axios';
import $ from 'jquery';

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
      // vm.tempOrder = Object.assign({}, item);
      context.commit('TEMP_ORDER', Object.assign({}, item));
      const dates = new Date(context.state.tempOrder.create_at * 1000);
      const year = dates.getFullYear();
      const month = dates.getMonth() + 1;
      const date = dates.getDate();
      // vm.tempOrder.total = parseInt(vm.tempOrder.total, 10);
      // vm.$set(vm.tempOrder, 'total', parseInt(vm.tempOrder.total, 10));
      context.commit('TOTAL', parseInt(context.state.tempOrder.total, 10));

      // vm.newDate = `${year}-${month}-${date}`;
      context.commit('NEW_DATE', `${year}-${month}-${date}`);
    },
    delOrderModal(context, item) {
      context.commit('DELETE_TEMP_ORDER', Object.assign({}, item));
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
  },
};
