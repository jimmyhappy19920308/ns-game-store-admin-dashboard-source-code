import axios from 'axios';

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
  },
  mutations: {
    ORDERS(state, orders) {
      state.orders = orders;
    },
    PAGINATION(state, pagination) {
      state.pagination = pagination;
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
  },
};
