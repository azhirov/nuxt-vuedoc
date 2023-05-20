<script lang="ts">
import {defineComponent} from 'vue'
import ExampleButton from "~/components/ExampleButton.vue";

export default defineComponent({
  name: "ExampleBtn1",
  components: {ExampleButton}
})
</script>

<template>
  <div class="vuedoc-test-1">
    <ExampleButton some-prop="text">
      Example button
    </ExampleButton>
  </div>
</template>

<style scoped lang="scss">
.vuedoc-test-1 {
  padding: 10px;
  background: #42d392;
}
</style>
