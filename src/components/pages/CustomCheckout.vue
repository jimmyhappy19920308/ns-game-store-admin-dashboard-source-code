<template>
  <div>
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="payOrder">
        <table class="table">
          <thead>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in order.products" :key="item.id">
              <td class="align-middle">{{ item.product.title }}</td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total | toFixed | currency }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-right">總計</td>
              <td class="text-right">{{ order.total | toFixed | currency }}</td>
            </tr>
          </tfoot>
        </table>

        <table class="table">
          <tbody>
            <tr>
              <th width="100">Email</th>
              <td>{{ order.user.email }}</td>
            </tr>
            <tr>
              <th>姓名</th>
              <td>{{ order.user.name }}</td>
            </tr>
            <tr>
              <th>收件人電話</th>
              <td>{{ order.user.tel }}</td>
            </tr>
            <tr>
              <th>收件人地址</th>
              <td>{{ order.user.address }}</td>
            </tr>
            <tr>
              <th>付款狀態</th>
              <td>
                <span v-if="!order.is_paid">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-right">
          <router-link class="btn btn-primary" to="/custom-orders" v-if="!order.is_paid">取消</router-link>
          <button class="btn btn-danger" v-if="!order.is_paid">確認付款去</button>
        </div>
      </form>
</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  filters: {
    toFixed(n) {
      return n.toFixed(0);
    },
  },
  computed: {
    ...mapGetters('ordersModule', ['order']),
  },
  methods: {
    getOrder() {
      this.$store.dispatch('ordersModule/getOrder', this.$route.params.orderId);
    },
    payOrder() {
      this.$store.dispatch('ordersModule/payOrder', this.$route.params.orderId);
    },
  },
  created() {
    const vm = this;

    vm.getOrder();
  },
};
</script>
