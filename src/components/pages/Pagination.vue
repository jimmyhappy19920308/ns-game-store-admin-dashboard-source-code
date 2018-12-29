<template>
  <div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': pagination.has_pre === false }"
        @click.prevent="getCurrentPage(pagination.current_page -1)">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item"
        v-for="page in pagination.total_pages" :key="page"
        :class="{ 'active': pagination.current_page === page }">
        <a class="page-link" href="#" @click.prevent="getCurrentPage(page)">{{ page }}</a></li>
        <li class="page-item" :class="{ 'disabled': pagination.has_next === false }"
        @click.prevent="getCurrentPage(pagination.current_page +1)">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('productsModule', ['pagination']),
  },
  methods: {
    getCurrentPage(page) {
      this.$store.dispatch('productsModule/getProducts', page);
    },
  },
};
</script>
