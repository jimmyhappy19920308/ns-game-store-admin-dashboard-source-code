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
    form: {
      user: {
        name: '',
        email: '',
        tel: '',
        address: '',
      },
      message: '',
    },
    order: {
      products: [],
      total: 0,
      user: {
        name: '',
        email: '',
        tel: '',
        address: '',
      },
    },
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
          const { message } = response.data;
          const status = 'danger';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
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
          const message = '已刪除該筆訂單';
          const status = 'success';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          context.dispatch('updateLoading', false, { root: true });

          $('#delOrderModal').modal('hide');

          context.dispatch('getOrders');
        } else {
          const message = '該筆訂單刪除失敗';
          const status = 'danger';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          context.dispatch('updateLoading', false, { root: true });

          $('#delOrderModal').modal('hide');

          context.dispatch('getOrders');
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
          const { message } = response.data;
          const status = 'success';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          context.dispatch('getOrders');
          context.dispatch('updateLoading', false, { root: true });

          $('#orderModal').modal('hide');
        } else {
          const { message } = response.data;
          const status = 'danger';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          context.dispatch('getOrders');
          context.dispatch('updateLoading', false, { root: true });

          $('#orderModal').modal('hide');
        }
      });
    },
    createOrder(context) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_CUSTOM_PATH}/order`;
      const order = context.state.form;

      axios.post(api, { data: order }).then(response => {
        if (response.data.success) {
          const { message } = response.data;
          const status = 'success';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });

          router.push(`/custom-checkout/${response.data.orderId}`);
        }
      });
    },
    getOrder(context, orderId) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/order/${orderId}`;

      context.dispatch('updateLoading', true, { root: true });

      axios.get(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          context.dispatch('updateLoading', false, { root: true });

          context.commit('ORDER', response.data.order);
        } else {
          context.dispatch('updateLoading', false, { root: true });
        }
      });
    },
    payOrder(context, orderId) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/pay/${orderId}`;
      axios.post(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          const { message } = response.data;
          const status = 'success';

          context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          context.dispatch('getOrder', orderId);
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
    FORM_USER_EMAIL(state, email) {
      state.form.user.email = email;
    },
    FORM_USER_NAME(state, name) {
      state.form.user.name = name;
    },
    FORM_USER_TEL(state, tel) {
      state.form.user.tel = tel;
    },
    FORM_USER_ADDRESS(state, address) {
      state.form.user.address = address;
    },
    FORM_MESSAGE(state, message) {
      state.form.message = message;
    },
    ORDER(state, order) {
      state.order = order;
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
    order(state) {
      return state.order;
    },
  },
};
