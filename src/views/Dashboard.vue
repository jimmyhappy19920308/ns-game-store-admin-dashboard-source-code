<template>
  <div class="hello">
    <loading :active.sync="isLoading"></loading>
    <nav-bar></nav-bar>
    <alert-message></alert-message>
    <div class="container-fluid">
      <div class="row">
        <side-bar></side-bar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import AlertMessage from '../components/AlertMessage.vue';

export default {
  name: 'Dashboard',
  components: {
    'side-bar': Sidebar,
    'nav-bar': Navbar,
    'alert-message': AlertMessage,
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
};
</script>
