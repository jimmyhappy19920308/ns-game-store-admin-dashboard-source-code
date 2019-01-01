<template>
  <div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in orders">
          <tr :key="item.id" v-if="!item.isRemove">
            <td>{{ item.create_at | date }}</td>
            <td><span>{{ item.user.email }}</span></td>
            <td>
              <ul class="list-unstyled">
                <li v-for="product in item.products" :key="product.id">
                  {{ product.product.title }} 數量：{{ product.qty }}
                  {{ product.product.unit }}
                </li>
              </ul>
            </td>
            <td class="text-right">{{ item.total | currency }}</td>
            <td>
              <strong class="text-success" v-if="item.is_paid">已付款</strong>
              <span class="text-muted" v-else>尚未付款</span>
            </td>
            <td>
              <button class="btn btn-outline-primary btn-sm" @click.prevent="editOrderModal(item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click.prevent="delOrderModal(item)">刪除</button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="modal fade" id="orderModal" tabindex="-1" role="dialog"
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
              <label for="due_date">購買時間</label>
              <input type="date" class="form-control" id="create_at"
              v-model="newDate">
            </div>
            <div class="form-group">
              <label for="email">信箱</label>
              <input type="text" class="form-control" id="email"
              v-model="email">
            </div>
            <div class="form-group">
              <p>購買款項</p>
              <template v-for="(item, index) in tempOrder.products">
                <table :key="item.product.create_at">
                  <thead>
                    <th><label :for="item.id" :key="item.product.create_at">商品名稱</label></th>
                    <th>數量</th>
                    <th>單位</th>
                  </thead>
                  <tbody>
                    <td>
                      <input type="text" class="form-control" :id="item.id" :value="item.product.title" @input="updateTitle(index, $event)" :key="item.product.create_at">
                    </td>
                    <td>
                      <input type="number" class="form-control" :value="item.qty" @input="updateQty(index, $event)"  :key="item.product.create_at">
                    </td>
                    <td>
                      <input type="text" class="form-control" :value="item.product.unit" @input="updateUnit(index, $event)">
                    </td>
                  </tbody>
                </table>
              </template>

            </div>
            <div class="form-group">
              <label for="total">應付金額</label>
              <input type="text" class="form-control" id="total"
              v-model.number="total">
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="is_paid"
                v-model="isPaid" :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_paid">
                  是否已付款
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click.prevent="updateOrder">
              <span>更新訂單</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delOrderModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除訂單</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempOrder.id }}</strong> 訂單(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click.prevent="removeOrder">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
    <pagination-component :parent-pagination="pagination" @get-page="getOrders"></pagination-component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import $ from 'jquery';
import Pagination from './Pagination.vue';

export default {
  components: {
    'pagination-component': Pagination,
  },
  computed: {
    ...mapGetters('ordersModule', ['orders', 'newDate', 'tempOrder', 'pagination', 'products']),
    newDate: {
      get() {
        return this.$store.state.ordersModule.newDate;
      },
      set(value) {
        this.$store.commit('ordersModule/NEW_DATE', value);
      },
    },
    email: {
      get() {
        return this.$store.state.ordersModule.tempOrder.user.email;
      },
      set(value) {
        this.$store.commit('ordersModule/EMAIL', value);
      },
    },
    total: {
      get() {
        return this.$store.state.ordersModule.tempOrder.total;
      },
      set(value) {
        this.$store.commit('ordersModule/TOTAL', value);
      },
    },
    isPaid: {
      get() {
        return this.$store.state.ordersModule.tempOrder.is_paid;
      },
      set(value) {
        this.$store.commit('ordersModule/IS_PAID', value);
      },
    },
  },
  methods: {
    getOrders(page = 1) {
      this.$store.dispatch('ordersModule/getOrders', page);
    },
    editOrderModal(item) {
      $('#orderModal').modal('show');

      this.$store.dispatch('ordersModule/editOrderModal', item);
    },
    delOrderModal(item) {
      this.$store.dispatch('ordersModule/delOrderModal', item);

      $('#delOrderModal').modal('show');
    },
    removeOrder() {
      this.$store.dispatch('ordersModule/removeOrder');
    },
    updateOrder() {
      this.$store.dispatch('ordersModule/updateOrder');
    },
    updateTitle(index, event) {
      const value = event.target.value;

      this.$store.commit('ordersModule/UPDATE_TITLE', { index, value });
    },
    updateQty(index, event) {
      const value = event.target.value;

      this.$store.commit('ordersModule/UPDATE_QTY', { index, value });
    },
    updateUnit(index, event) {
      const value = event.target.value;

      this.$store.commit('ordersModule/UPDATE_UNIT', { index, value });
    },
  },
  created() {
    const vm = this;
    vm.getOrders();
  },
};
</script>
