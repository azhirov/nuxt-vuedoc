<script lang="ts">
import {defineComponent} from 'vue'
import ButtonPrimary from "~/components/Button/ButtonPrimary.vue";

export default defineComponent({
  components: {ButtonPrimary}
})
</script>

<template>
  <div class="vex-links">
    <ButtonPrimary
      color="default"
      href="https://google.com"
      target="_blank"
    >
      HTML Link
    </ButtonPrimary>
    <ButtonPrimary
      color="default"
      to="/"
    >
      Router link
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
