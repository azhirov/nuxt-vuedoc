<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ExampleButton',
  props: {
    /**
    * Value of `type` attribute
    */
    htmlType: {
      type: String as PropType<'button' | 'submit'>,
      default: 'button',
    },
    /**
    * Button color
    */
    color: {
      type: String as PropType<'primary' | 'secondary' | 'success' | 'danger'>,
      default: null,
    }
  }
})
</script>

<template>
  <button class="example-button">
    <span class="example-button__icon">
      <slot name="icon" />
    </span>
    <span class="example-button__text">
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">

</style>
