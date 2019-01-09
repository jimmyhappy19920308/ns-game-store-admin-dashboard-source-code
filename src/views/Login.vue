<template>
  <div>
    <form class="form-signin mt-5">
      <img class="mb-4" src="" alt="" width="72" height="72">
      <h1 class="h5 my-5 font-weight-normal text-danger text-center"><i class="fab fa-nintendo-switch mr-3"></i>NS GameStore 後台系統</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Email address" name="email" v-validate="'required|email'" v-model="username" @keyup.enter="signIn">
      <div class="text-danger my-3">
        {{ errors.first('email') }}
      </div>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="password" v-validate="{ required: true, regex: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,20}$/ }" name="password" @keyup.enter="signIn">
      <div  class="text-danger" v-if="errors.has('password')">
        密碼必須是6-20位英數混合字，不可以輸入空白字元、特殊符號。
      </div>
      <button class="btn btn-lg btn-primary btn-block mt-5" type="button" @click.prevent="signIn">
        Sign in
      </button>
      <div class="d-flex justify-content-center">
        <span class="h4 text-danger mt-4"> {{ errorMessage }} </span>
      </div>
      <p class="mt-5 mb-3 text-muted text-center">&copy; 2018-2019</p>
    </form>
  </div>
</template>

<script>
export default {
  computed: {
    username: {
      get() {
        return this.$store.state.authModule.user.username;
      },
      set(value) {
        this.$store.commit('authModule/USER_NAME', value);
      },
    },
    password: {
      get() {
        return this.$store.state.authModule.user.password;
      },
      set(value) {
        this.$store.commit('authModule/PASSWORD', value);
      },
    },
    errorMessage() {
      return this.$store.state.authModule.errorMessage;
    },
  },
  methods: {
    signIn() {
      this.$validator.validate().then(result => {
        if (!result) {
          // do stuff if not valid.
        } else {
          this.$store.dispatch('authModule/signIn');
        }
      });
    },
    updateUserName(e) {
      this.$store.dispatch('authModule/updateUserName', e.target.value);
    },
    updatePassword(e) {
      this.$store.dispatch('authModule/updatePassword', e.target.value);
    },
  },
};
</script>

<style scoped>
html {
  height: 100vh;
}
body {
  min-height: 100vh;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type='email'] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type='password'] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
