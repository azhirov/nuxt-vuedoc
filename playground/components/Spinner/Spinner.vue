<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "UiSpinner"
})
</script>

<template>
  <div class="ui-spinner" />
</template>

<style lang="scss">
.ui-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-flex;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
