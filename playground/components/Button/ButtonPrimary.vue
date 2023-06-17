<script lang="ts">
import {defineComponent, PropType} from 'vue'
import type { Location } from 'vue-router';
import UiSpinner from "~/components/Spinner/Spinner.vue";

export default defineComponent({
  name: "ButtonPrimary",
  components: {UiSpinner},
  props: {
    /**
     * Button color
     */
    color: {
      type: String as PropType<'blue' | 'green' | 'red' | 'default'>,
      required: true,
    },
    /**
     * Button HTML-type
     */
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
    /**
     * Use this prop for generate `<a>` tag
     */
    href: {
      type: String,
      default: null,
    },
    /**
     * Use this prop for generate `<nuxt-link>` tag
     */
    to: {
      type: [String, Object] as PropType<string | Location>,
      default: null,
    },
    /**
     * Disable clicks on button
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Show spinner
     * @since 1.2
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * Show icon
     * @deprecated
     */
    icon: {
      type: String,
      default: null,
    },
  },
  computed: {
    classes() {
      return {
        'ui-btn': true,
        'ui-btn--loading': this.loading,
        [`ui-btn--color-${this.color}`]: this.color !== "default",
      }
    },
    isNuxtLink() {
      return this.to !== null;
    },
    isHtmlLink() {
      return !this.isNuxtLink && this.href !== null;
    },
    tag() {
      if (this.isNuxtLink) return 'nuxt-link';
      if (this.isHtmlLink) return 'a';
      return 'button';
    },
    linkAttrs() {
      if (this.isHtmlLink) {
        return {
          href: this.href,
        }
      }
      if (this.isNuxtLink) {
        return {
          to: this.to,
        }
      }
      return {};
    }
  },
  methods: {
    /**
     * Click on button element
     * @public
     */
    click() {
      this.$el?.click();
    },
    onClick(e: PointerEvent) {
      /**
       * Triggers when user click the button
       * @property {PointerEvent} event event data
       * @since 1.0
       */
      this.$emit('click', e);
    },
    onPointerEnter(e: PointerEvent) {
      /**
       * Triggers when user hover the button
       * @property {PointerEvent} event event data
       * @since 1.2
       * @deprecated
       */
      this.$emit('pointer-enter', e);
    },
    onPointerLeave(e: PointerEvent) {
      /**
       * Triggers when user leave the button
       * @property {PointerEvent} event event data
       * @since 1.2
       * @deprecated
       */
      this.$emit('pointer-leave', e);
    }
  }
});
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    v-bind="linkAttrs"
    :disabled="disabled"
    @click="onClick"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <span
      v-if="loading"
      class="ui-btn__spinner"
    >
      <!--
				@slot Use this slot to replace default spinner
				@binding {boolean} loading indicate loading state
			-->
      <slot
        name="spinner"
        :loading="loading"
      >
        <ui-spinner />
      </slot>
    </span>
    <span class="ui-btn__content">
      <!--
				@slot Button content
				@binding {object} icon icon of the menu item
				@binding {string} text text of the menu item
			-->
      <slot />
    </span>
  </component>
</template>

<style lang="scss">
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  color: #333;
  border: none;
  margin: 0;
  cursor: pointer;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25), inset 0px 0px 0px 0.5px rgba(0, 0, 0, 0.19);
  text-decoration: none !important;
  position: relative;

  @at-root a#{&}, button#{&} {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.15;
  }

  @at-root a#{&} {
    &, &:hover {
      color: #333;
    }
  }

  &__spinner {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .ui-spinner {
      width: 16px;
      height: 16px;
    }
  }

  &--loading &__content {
    visibility: hidden;
  }

  &--color-blue {
    background: #4088EE;
    color: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25), inset 0px 0px 0px 0.5px rgba(0, 0, 0, 0.19);
    @at-root a#{&} {
      &, &:hover {
        color: #fff;
      }
    }
  }
  &--color-red {
    background: #FB5548;
    color: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25), inset 0px 0px 0px 0.5px rgba(0, 0, 0, 0.19);
    @at-root a#{&} {
      &, &:hover {
        color: #fff;
      }
    }
  }
  &--color-green {
    background: #5ABC5E;
    color: #fff;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25), inset 0px 0px 0px 0.5px rgba(0, 0, 0, 0.19);
    @at-root a#{&} {
      &, &:hover {
        color: #fff;
      }
    }
  }

  &:disabled {
    cursor: not-allowed;
    color: rgba(#000, 0.4);
    @at-root a#{&} {
      &, &:hover {
        color: rgba(#000, 0.4);
      }
    }
  }
  &--color-blue, &--color-green, &--color-red {
    &:disabled {
      color: rgba(#fff, 0.4);
      @at-root a#{&} {
        &, &:hover {
          color: rgba(#fff, 0.4);
        }
      }
    }
  }
}
</style>
