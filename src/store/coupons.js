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
    pagination: {},
    coupon_code: '',
  },
  actions: {
    getCoupons(context, page) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/coupons?page=${page}`;

      context.dispatch('updateLoading', true, { root: true });

      axios.get(api).then(response => {
        context.dispatch('updateLoading', false, { root: true });

        context.commit('COUPONS', response.data.coupons);
        context.commit('PAGINATION', response.data.pagination);
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
    delCouponModal(context, item) {
      context.commit('TEMP_COUPON', Object.assign({}, item));

      $('#delCouponModal').modal('show');
    },
    updateCoupon(context, id) {
      let api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/coupon`;
      let httpMethod = 'post';

      if (!context.state.isNew) {
        api = `${process.env.VUE_APP_API_PATH}/api/${
          process.env.VUE_APP_CUSTOM_PATH
        }/admin/coupon/${id}`;
        httpMethod = 'put';
      }

      axios[httpMethod](api, { data: context.state.tempCoupon }).then(response => {
        if (response.data.success) {
          $('#couponModal').modal('hide');

          context.dispatch('getCoupons');

          if (context.state.isNew) {
            const { message } = response.data;
            const status = 'success';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          } else {
            const { message } = response.data;
            const status = 'success';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
          }
        } else {
          $('#couponModal').modal('hide');

          context.dispatch('getCoupons');

          if (context.state.isNew) {
            const { message } = response.data;
            const status = 'danger';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
            console.log('Copon 新增失敗');
          } else {
            const { message } = response.data;
            const status = 'danger';

            context.dispatch('messageModule/updateMessage', { message, status }, { root: true });
            console.log('Copon 編輯失敗');
          }
        }
      });
    },
    removeCoupon(context, id) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/coupon/${id}`;

      context.dispatch('updateLoading', true, { root: true });

      axios.delete(api).then(response => {
        context.dispatch('updateLoading', false, { root: true });

        if (response.data.success) {
          $('#delCouponModal').modal('hide');

          context.dispatch('getCoupons');

          console.log('優惠券刪除成功');
        } else {
          $('#delCouponModal').modal('hide');

          context.dispatch('getCoupons');

          console.log('優惠券刪除失敗');
          console.log(response.data.message);
        }
      });
    },
    applyCouponCode(context) {
      const api = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_CUSTOM_PATH}/coupon`;
      const coupon = {
        code: context.state.coupon_code,
      };

      context.dispatch('updateLoading', true, { root: true });

      axios.post(api, { data: coupon }).then(response => {
        // console.log(response);
        if (response.data.success) {
          context.dispatch('cartsModule/getCart', null, { root: true });
          context.dispatch('updateLoading', false, { root: true });
        } else {
          context.dispatch('updateLoading', false, { root: true });
        }
      });
    },
  },
  mutations: {
    COUPONS(state, coupons) {
      state.coupons = coupons;
    },
    TEMP_COUPON(state, tempCoupon) {
      state.tempCoupon = tempCoupon;
    },
    IS_NEW(state, isNew) {
      state.isNew = isNew;
    },
    UPDATE_TITLE(state, title) {
      state.tempCoupon.title = title;
    },
    UPDATE_CODE(state, code) {
      state.tempCoupon.code = code;
    },
    UPDATE_DUE_DATE(state, dueDate) {
      state.tempCoupon.due_date = dueDate;
    },
    UPDATE_PERCENT(state, percent) {
      state.tempCoupon.percent = percent;
    },
    UPDATE_IS_ENABLED(state, isEnabled) {
      state.tempCoupon.is_enabled = isEnabled;
    },
    PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    COUPON_CODE(state, couponCode) {
      state.coupon_code = couponCode;
    },
  },
  getters: {
    coupons(state) {
      return state.coupons;
    },
    isNew(state) {
      return state.isNew;
    },
    tempCoupon(state) {
      return state.tempCoupon;
    },
    pagination(state) {
      return state.pagination;
    },
  },
};
