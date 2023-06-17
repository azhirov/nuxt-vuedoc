<script lang="ts">
import {defineComponent} from 'vue'
import ButtonPrimary from "~/components/Button/ButtonPrimary.vue";

export default defineComponent({
  name: "ExampleBtn1",
  components: {ButtonPrimary}
})
</script>

<template>
  <div class="vuedoc-test-1">
    <ButtonPrimary color="default">
      Button
    </ButtonPrimary>
    <ButtonPrimary color="blue">
      Button
    </ButtonPrimary>
    <ButtonPrimary color="red">
      Button
    </ButtonPrimary>
    <ButtonPrimary color="green">
      Button
    </ButtonPrimary>
  </div>
</template>

<style scoped lang="scss">
.vuedoc-test-1 {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
