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
        <th>編輯</th>
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
            <button type="button" class="btn btn-outline-primary btn-sm mr-3" @click.prevent="productModal(false, item)">編輯</button>
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
                  <input type="text" class="form-control" :value="tempProduct.title" @input="updateTitle" id="title"
                    placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" :value="tempProduct.category" @input="updateCategory" id="category"
                      placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" :value="tempProduct.unit" @input="updateUnit" id="unit"
                      placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" :value="tempProduct.origin_price" @input="updateOriginPrice" id="origin_price"
                      placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" :value="tempProduct.price" @input="updatePrice" id="price"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" :value="tempProduct.description" @input="updateDescription" id="description"
                    placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" :value="tempProduct.content" @input="updateContent" id="content"
                    placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                    v-model="isEnabled"
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
            <button type="button" class="btn btn-danger" @click.prevent="removeProduct(tempProduct.id)">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
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
    ...mapGetters('productsModule', [
      'products',
      'pagination',
      'tempProduct',
      'isNew',
      'isUploadImage',
    ]),
    isEnabled: {
      get() {
        return this.$store.state.productsModule.tempProduct.is_enabled;
      },
      set(value) {
        this.$store.commit('productsModule/IS_ENABLED', value);
      },
    },
  },
  methods: {
    getProducts(page = 1) {
      this.$store.dispatch('productsModule/getProducts', page);
    },
    productModal(isNew, item) {
      this.$store.dispatch('productsModule/productModal', { isNew, item });
    },
    delProductModal(item) {
      this.$store.dispatch('productsModule/delProductModal', item);
    },
    updateProduct() {
      this.$store.dispatch('productsModule/updateProduct');
    },
    removeProduct(id) {
      this.$store.dispatch('productsModule/removeProduct', id);
    },
    uploadImage() {
      const vm = this;
      const uploadedImage = vm.$refs.files.files[0];

      this.$store.dispatch('productsModule/uploadImage', uploadedImage);

      vm.$refs.files.value = '';
    },
    updateTitle(e) {
      this.$store.dispatch('productsModule/updateTitle', e.target.value);
    },
    updateCategory(e) {
      this.$store.dispatch('productsModule/updateCategory', e.target.value);
    },
    updateOriginPrice(e) {
      this.$store.dispatch('productsModule/updateOriginPrice', e.target.value);
    },
    updatePrice(e) {
      this.$store.dispatch('productsModule/updatePrice', e.target.value);
    },
    updateUnit(e) {
      this.$store.dispatch('productsModule/updateUnit', e.target.value);
    },
    updateDescription(e) {
      this.$store.dispatch('productsModule/updateDescription', e.target.value);
    },
    updateContent(e) {
      this.$store.dispatch('productsModule/updateContent', e.target.value);
    },
  },
  created() {
    const vm = this;
    vm.getProducts();
  },
};
</script>
