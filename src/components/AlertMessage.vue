<template>
  <div class="message-alert">
    <div class="alert alert-dismissible"
      :class="'alert-' + item.status"
      v-for="(item, index) in messages" :key="index">
      {{ item.message }}
      <button type="button" class="close" @click="removeMessage(index)" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('messageModule', ['messages']),
  },
  methods: {
    removeMessage(index) {
      this.$store.dispatch('messageModule/removeMessage', index);
    },
  },
};
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>
