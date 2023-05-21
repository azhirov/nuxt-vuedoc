<script lang="ts">
import {defineComponent} from 'vue'
import ButtonPrimary from "~/components/Button/ButtonPrimary.vue";
import {clearTimeout} from "timers";

export default defineComponent({
  components: {ButtonPrimary},
})
</script>

<template>
  <div>
    <div class="vex-spinner-colors" style="margin-bottom: 10px;">
      <ButtonPrimary
        color="default"
        loading
      >
        Default
      </ButtonPrimary>
      <ButtonPrimary
        color="blue"
        loading
      >
        Blue
      </ButtonPrimary>
      <ButtonPrimary
        color="red"
        loading
      >
        Red
      </ButtonPrimary>
      <ButtonPrimary
        color="green"
        loading
      >
        Green
      </ButtonPrimary>
    </div>
    <div class="vex-spinner-colors">
      <ButtonPrimary
        color="default"
      >
        Default
      </ButtonPrimary>
      <ButtonPrimary
        color="blue"
      >
        Blue
      </ButtonPrimary>
      <ButtonPrimary
        color="red"
      >
        Red
      </ButtonPrimary>
      <ButtonPrimary
        color="green"
      >
        Green
      </ButtonPrimary>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vex-spinner-colors {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
