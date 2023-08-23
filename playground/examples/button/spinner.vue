<script lang="ts">
import {defineComponent} from 'vue'
import ButtonPrimary from "~/components/Button/ButtonPrimary.vue";

export default defineComponent({
  components: {ButtonPrimary},
  data() {
    return {
      loading: false,
      timeout: null as any,
    }
  },
  beforeUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  },
  methods: {
    enableLoading() {
      if (this.loading) return;
      this.loading = true;
      this.timeout = setTimeout(() => {
        this.loading = false;
      }, 2000);
    }
  }
})
</script>

<template>
  <div class="vex-links">
    <ButtonPrimary
      color="default"
      :loading="loading"
      @click="enableLoading"
    >
      Click to load
    </ButtonPrimary>
  </div>
</template>

<style scoped lang="scss">
.vex-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
