<script lang="ts">
import {defineComponent} from 'vue'
import ButtonPrimary from "~/components/Button/ButtonPrimary.vue";

export default defineComponent({
  name: "ExampleBtn2",
  components: {ButtonPrimary}
})
</script>

<template>
  <div class="vuedoc-test-2">
    <ButtonPrimary
      disabled
      color="default"
    >
      Button
    </ButtonPrimary>
    <ButtonPrimary
      color="blue"
      disabled
    >
      Button
    </ButtonPrimary>
    <ButtonPrimary
      color="red"
      disabled
    >
      Button
    </ButtonPrimary>
    <ButtonPrimary
      color="green"
      disabled
    >
      Button
    </ButtonPrimary>
  </div>
</template>

<style scoped lang="scss">
.vuedoc-test-2 {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
