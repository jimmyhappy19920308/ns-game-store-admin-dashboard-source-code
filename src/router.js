import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login.vue'),
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: () => import('./views/Dashboard.vue'),
      // meta: { requiresAuth: true },
      children: [
        {
          path: 'products',
          name: 'Products',
          component: () => import('./components/pages/Products.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('./components/pages/Orders.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: () => import('./components/pages/Coupons.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/',
      name: 'Dashboard2',
      component: () => import('./views/Dashboard.vue'),
      // meta: { requiresAuth: true },
      children: [
        {
          path: 'custom-orders',
          name: 'CustomOrders',
          component: () => import('./components/pages/CustomOrders.vue'),
        },
        {
          path: 'custom-checkout/:orderId',
          name: 'CustomCheckout',
          component: () => import('./components/pages/CustomCheckout.vue'),
        },
      ],
    },
    {
      path: '*',
      redirect: 'login',
    },
  ],
});
