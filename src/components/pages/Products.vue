<template>
  <div>
    <div class="text-right">
      <button type="button" class="btn btn-primary mt-3" @click.prevent="productModal(true)">建立新的產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="120">使否啟用</th>
        <th width="120">編輯</th>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.origin_price | currency }}</td>
          <td>{{ item.price | currency }}</td>
          <td>
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button type="button" class="btn btn-outline-primary btn-sm" @click.prevent="productModal(false, item)">編輯</button>
            <button type="button" class="btn btn-outline-danger btn-sm" @click.prevent="delProductModal(item)">刪除</button>
          </td>

        </tr>
      </tbody>
    </table>
    <pagination-component></pagination-component>
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="isUploadImage"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control"
                    ref="files" @change="uploadImage">
                </div>
                <img :src="tempProduct.imageUrl"
                  class="img-fluid" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" v-model="tempProduct.title" id="title"
                    placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" v-model="tempProduct.category" id="category"
                      placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" v-model="tempProduct.unit" id="unit"
                      placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" v-model="tempProduct.origin_price" id="origin_price"
                      placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" v-model="tempProduct.price" id="price"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" v-model="tempProduct.description" id="description"
                    placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" v-model="tempProduct.content" id="content"
                    placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                    v-model="tempProduct.is_enabled"
                    :true-value="1"
                    :false-value="0"
                    id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click.prevent="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click.prevent="removeProduct">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import $ from 'jquery';
import Pagination from './Pagination.vue';

export default {
  data() {
    return {
      tempProduct: {},
      isNew: false,
      isUploadImage: false,
    };
  },
  components: {
    'pagination-component': Pagination,
  },
  computed: {
    ...mapGetters('productsModule', ['products', 'pagination']),
  },
  methods: {
    getProducts(page = 1) {
      this.$store.dispatch('productsModule/getProducts', page);
    },
    productModal(isNew, item) {
      const vm = this;

      if (isNew) {
        vm.tempProduct = {};
        vm.isNew = true;
      } else {
        vm.tempProduct = Object.assign({}, item);
        vm.isNew = false;
      }

      $('#productModal').modal('show');
    },
    delProductModal(item) {
      const vm = this;
      vm.tempProduct = Object.assign({}, item);
      $('#delProductModal').modal('show');
    },
    updateProduct() {
      const vm = this;
      let api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/product`;
      let httpMethod = 'post';
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_API_PATH}/api/${
          process.env.VUE_APP_CUSTOM_PATH
        }/admin/product/${vm.tempProduct.id}`;
        httpMethod = 'put';
      }
      vm.$http[httpMethod](api, { data: vm.tempProduct }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $('#productModal').modal('hide');
          vm.getProducts();
          if (vm.isNew) {
            console.log('新增成功');
          } else {
            console.log('編輯成功');
          }
        } else {
          $('#productModal').modal('hide');
          vm.getProducts();
          if (vm.isNew) {
            console.log('新增失敗');
          } else {
            console.log('編輯失敗');
          }
        }
      });
    },
    removeProduct() {
      const vm = this;
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/product/${vm.tempProduct.id}`;
      vm.$http.delete(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $('#delProductModal').modal('hide');
          vm.getProducts();
        } else {
          $('#delProductModal').modal('hide');
          vm.getProducts();
          console.log('商品刪除失敗');
        }
      });
    },
    uploadImage() {
      const vm = this;
      const api = `${process.env.VUE_APP_API_PATH}/api/${
        process.env.VUE_APP_CUSTOM_PATH
      }/admin/upload`;
      // console.log(vm);
      const uploadedImage = vm.$refs.files.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', uploadedImage);
      vm.isUploadImage = true;
      vm.$http
        .post(api, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          vm.isUploadImage = false;
          // console.log(response.data);
          if (response.data.success) {
            // vm.tempProduct.imageUrl = response.data.imageUrl;
            vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
          } else {
            vm.$bus.$emit('message:push', response.data.message, 'danger');
          }
        });
      vm.$refs.files.value = '';
    },
  },
  created() {
    const vm = this;
    vm.getProducts();
  },
};
</script>
