<template>
  <div>
    <div class="text-right">
      <button class="btn btn-primary mt-3" @click.prevent="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in coupons" :key="index">
          <td> {{ item.title }} </td>
          <td> {{ item.percent }} %</td>
          <td> {{item.due_date | formatDate }} </td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-muted">未起用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm mr-3" @click.prevent="openCouponModal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click.prevent="delCouponModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title" placeholder="請輸入標題"
              v-model="title">
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input type="text" class="form-control" id="coupon_code" placeholder="請輸入優惠碼"
              v-model="code">
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" id="due_date"
              v-model="dueDate">
            </div>
            <div class="form-group">
              <label for="price">折扣百分比</label>
              <input type="number" class="form-control" id="price" placeholder="請輸入折扣百分比"
              v-model="percent">
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="is_enabled"
                v-model="isEnabled" :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click.prevent="updateCoupon(tempCoupon.id)">
              <span v-if="isNew">新增優惠券</span>
              <span v-else>更新優惠券</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ title }}</strong> 優惠券(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click.prevent="removeCoupon(tempCoupon.id)">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
    <pagination-component></pagination-component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Pagination from './Pagination.vue';

export default {
  components: {
    'pagination-component': Pagination,
  },
  computed: {
    ...mapGetters('couponsModule', ['coupons', 'isNew', 'tempCoupon']),
    title: {
      get() {
        return this.$store.state.couponsModule.tempCoupon.title;
      },
      set(value) {
        this.$store.commit('couponsModule/UPDATE_TITLE', value);
      },
    },
    code: {
      get() {
        return this.$store.state.couponsModule.tempCoupon.code;
      },
      set(value) {
        this.$store.commit('couponsModule/UPDATE_CODE', value);
      },
    },
    dueDate: {
      get() {
        return this.$store.state.couponsModule.tempCoupon.due_date;
      },
      set(value) {
        this.$store.commit('couponsModule/UPDATE_DUE_DATE', value);
      },
    },
    percent: {
      get() {
        return this.$store.state.couponsModule.tempCoupon.percent;
      },
      set(value) {
        this.$store.commit('couponsModule/UPDATE_PERCENT', value);
      },
    },
    isEnabled: {
      get() {
        return this.$store.state.couponsModule.tempCoupon.is_enabled;
      },
      set(value) {
        this.$store.commit('couponsModule/UPDATE_IS_ENABLED', value);
      },
    },
  },
  methods: {
    getCoupons() {
      this.$store.dispatch('couponsModule/getCoupons');
    },
    openCouponModal(isNew, item) {
      this.$store.dispatch('couponsModule/openCouponModal', { isNew, item });
    },
    delCouponModal(item) {
      this.$store.dispatch('couponsModule/delCouponModal', item);
    },
    updateCoupon(id) {
      this.$store.dispatch('couponsModule/updateCoupon', id);
    },
    removeCoupon(id) {
      this.$store.dispatch('couponsModule/removeCoupon', id);
    },
  },
  filters: {
    formatDate(n) {
      return n.split('-').join('/');
    },
  },
  created() {
    const vm = this;
    vm.getCoupons();
  },
};
</script>
