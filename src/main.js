import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import './bus';

import App from './App.vue';
import router from './router';
import currencyFilter from './filters/currency';
import date from './filters/date';

Vue.component('loading', Loading);

Vue.use(Vuex);
Vue.use(VueAxios, axios);

Vue.use(VeeValidate, {
  events: 'input|change|blur',
});
VeeValidate.Validator.localize('zh_TW', zhTWValidate);

Vue.filter('currency', currencyFilter);
Vue.filter('date', date);

axios.defaults.withCredentials = true;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
