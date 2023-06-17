<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ExampleButton',
  props: {
    /**
    * Deprecated
    * @deprecated
    */
    deprecatedProp: {
      type: String,
      default: null,
    },
    /**
    * Function def
    * @deprecated 2.4
    */
    cb: {
      type: Function,
      default: () => ([1,2,3]),
    },
    /**
    * Ignore this prop
    * @ignore
    */
    cb2: {
      type: Function,
      default: () => ([1,2,3]),
    },
    /**
    * __Required__ property
     * @values val1, val2 - foo, val3
    */
    someProp: {
      type: String,
      required: true,
    },
    /**
    * Value of `type` attribute
     * @since 3.4.2
     * @example 'submit'
    */
    htmlType: {
      type: String as PropType<'button' | 'submit'>,
      default: 'button',
    },
    /**
    * Button color
     * @since
    */
    color: {
      type: [String, Number] as PropType<'primary' | 'secondary' | 'success' | 'danger'>,
      default: null,
    }
  },
  methods: {
    emit() {
      /**
       * Triggers when the number changes
       *
       * @property {number | string, boolean} newValue new value set
       * @property {object} oldValue value that was set before the change
       * @property {object} oldValue.name user name
       */
      this.$emit('change', 1, 2)
    },
    onClick() {
      /**
       * Triggers when user click the button
       * @property {PointerEvent} e event data
       * @since 2.0
       */
      this.$emit('click', new PointerEvent('click'))

      /**
       * Triggers when user click the button
       * @deprecated use @click
       */
      this.$emit('click2')
    },
    /**
     * Gets called when the user clicks on the button
     *
     * @param {SyntheticEvent} param1 The react `SyntheticEvent`
     * @param {Number} flag Numbers of examples
     * @public This is a public method
     * @since 1.2.0
     * @deprecated Deprecated after 1.4.0
     */
    click(param1: string, flag: boolean) {
      console.log({ param1, flag });
    }
  }
})
</script>

<template>
  <button class="example-button">
    <span class="example-button__icon">
      <!--
				@slot Menu Item footer
				@binding {object} icon icon of the menu item
				@binding {string} text text of the menu item
			-->
      <slot
        name="icon"
        :icon="'icon'"
        :text="'text'"
      />
    </span>
    <span class="example-button__text">
      <!--
				@slot Button content
			-->
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">

</style>
