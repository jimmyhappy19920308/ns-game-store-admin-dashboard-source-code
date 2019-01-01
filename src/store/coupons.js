import axios from 'axios';
import $ from 'jquery';

export default {
  namespaced: true,
  state: {
    coupons: [],
    isNew: false,
    isLoading: false,
    tempCoupon: {
      title: '',
      is_enabled: false,
      percent: 100,
      due_date: 0,
      code: '',
    },
  },
  actions: {
    getCoupons(context) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/coupons`;

      context.dispatch('updateLoading', true, { root: true });

      axios.get(api).then(response => {
        context.dispatch('updateLoading', false, { root: true });

        context.commit('COUPONS', response.data.coupons);
      });
    },
  },
  mutations: {
    COUPONS(state, coupons) {
      state.coupons = coupons;
    },
  },
};
