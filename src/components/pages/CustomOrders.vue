<template>
  <div>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px; background-size: cover; background-position: center"
            :style="{ backgroundImage: `url(${item.imageUrl})` }">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <del class="h5" v-if="!item.price">原價 {{ item.origin_price }} 元</del>
              <del class="h6" v-if="item.origin_price">原價 {{ item.origin_price }} 元</del>
              <div class="h5" v-if="item.origin_price">現在只要 {{ item.price }} 元</div>
              <div class="h5" v-else>{{ item.price }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click.prevent="addToCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num" >
                選購 {{ num }} {{ product.unit }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
              @click="addToCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="my-5 row justify-content-center">
      <div class="my-5 row justify-content-center">
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id">
              <td class="align-middle">
                <button type="button" class="btn btn-outline-danger btn-sm"
                @click.prevent="removeCart(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total | toFixed }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total | toFixed }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" :value="coupon_code" @input="updateCouponCode" placeholder="請輸入優惠碼">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="applyCouponCode">
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>
        <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input type="email" class="form-control" name="email" id="useremail" v-validate="'required|email'" v-model="email" placeholder="請輸入 Email">
          <span class="text-danger">
            {{ errors.first('email') }}
          </span>
        </div>
        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input type="text" class="form-control" name="name" id="username" v-validate="'required'" v-model="name" placeholder="輸入姓名">
          <span class="text-danger" v-if="errors.has('name')">請輸入姓名</span>
        </div>
        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input type="tel" class="form-control" name="usertel" id="usertel" v-validate="{ required: true, regex: /^09\d{8}$/ }" v-model="tel" placeholder="0975655123">
          <span class="text-danger" v-if="errors.has('usertel')">此欄位不得留空或格式錯誤</span>
        </div>
        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input type="address" class="form-control" name="address" id="useraddress" v-validate="'required'" v-model="address" placeholder="請輸入地址">
          <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
        </div>
        <div class="form-group">
          <label for="useraddress">留言</label>
          <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger" @click.prevent="createOrder">送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import $ from 'jquery';

export default {
  computed: {
    ...mapGetters('productsModule', ['products', 'product']),
    ...mapGetters('cartsModule', ['cart']),
    ...mapGetters(['status']),
    ...mapState('couponsModule', ['coupon_code']),
    email: {
      get() {
        return this.$store.state.ordersModule.form.user.email;
      },
      set(value) {
        this.$store.commit('ordersModule/FORM_USER_EMAIL', value);
      },
    },
    name: {
      get() {
        return this.$store.state.ordersModule.form.user.name;
      },
      set(value) {
        this.$store.commit('ordersModule/FORM_USER_NAME', value);
      },
    },
    tel: {
      get() {
        return this.$store.state.ordersModule.form.user.tel;
      },
      set(value) {
        this.$store.commit('ordersModule/FORM_USER_TEL', value);
      },
    },
    address: {
      get() {
        return this.$store.state.ordersModule.form.user.address;
      },
      set(value) {
        this.$store.commit('ordersModule/FORM_USER_ADDRESS', value);
      },
    },
    message: {
      get() {
        return this.$store.state.ordersModule.form.message;
      },
      set(value) {
        this.$store.commit('ordersModule/FORM_MESSAGE', value);
      },
    },
  },
  methods: {
    getProducts(page = 1) {
      this.$store.dispatch('productsModule/getProducts', page);
    },
    getProduct(id) {
      this.$store.dispatch('productsModule/getProduct', id);
    },
    addToCart(id, qty = 1) {
      this.$store.dispatch('cartsModule/addToCart', { id, qty });
    },
    removeCart(id) {
      this.$store.dispatch('cartsModule/removeCart', id);
    },
    getCart() {
      this.$store.dispatch('cartsModule/getCart');
    },
    applyCouponCode() {
      this.$store.dispatch('couponsModule/applyCouponCode');
    },
    createOrder() {
      this.$validator.validate().then(result => {
        if (!result) {
          // do stuff if not valid.
          console.log('請確認所有欄位皆正確填寫');
        } else {
          this.$store.dispatch('ordersModule/createOrder');
        }
      });
    },
    updateCouponCode(e) {
      this.$store.commit('couponsModule/COUPON_CODE', e.target.value);
    },
  },
  filters: {
    toFixed(n) {
      return n.toFixed(0);
    },
  },
  created() {
    const vm = this;
    vm.getProducts();
    vm.getCart();
  },
};
</script>
