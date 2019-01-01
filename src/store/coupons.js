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
    openCouponModal(context, { isNew, item }) {
      if (isNew) {
        context.commit('TEMP_COUPON', {});
        context.commit('IS_NEW', true);
      } else {
        context.commit('TEMP_COUPON', Object.assign({}, item));
        context.commit('IS_NEW', false);
      }
      $('#couponModal').modal('show');
    },
  },
  mutations: {
    COUPONS(state, coupons) {
      state.coupons = coupons;
    },
  },
};
