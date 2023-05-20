<script lang="ts">
import {defineComponent} from 'vue'
import hljs from 'highlight.js';
import {decode} from "html-entities";

export default defineComponent({
  name: "VuedocExample",
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      sourceHeight: 0 as number | null,
      isExpanded: false,
    }
  },
  computed: {
    sourceHtml() {
      if (!this.source) return '';
      const { value } = hljs.highlightAuto(decode(this.source));
      return value;
    },
    sourceStyles() {
      return {
        height: this.sourceHeight !== null ? `${this.sourceHeight}px` : '',
      }
    }
  },
  methods: {
    expand() {
      this.sourceHeight = (this.$refs.collapse as HTMLElement)?.scrollHeight;
      this.isExpanded = true;
    },
    collapse() {
      this.isExpanded = false;
      this.sourceHeight = (this.$refs.collapse as HTMLElement)?.scrollHeight;
      this.$nextTick(() => {
        void (this.$refs.collapse as HTMLElement)?.scrollHeight;
        this.sourceHeight = 0;
      })
    },
    toggle() {
      if (this.isExpanded) {
        this.collapse();
      } else {
        this.expand();
      }
    },
    onTransitionEnd() {
      if (this.isExpanded) {
        this.sourceHeight = null;
      }
    }
  },
})
</script>

<template>
  <div class="vuedoc-example">
    <div class="vuedoc-example__content">
      <slot />
    </div>
    <div class="vuedoc-example__actions">
      <button
        class="vuedoc-example__action"
        :class="{'vuedoc-example__action--active': isExpanded}"
        @click="toggle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        ><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
        <span>Source code</span>
      </button>
    </div>
    <div
      ref="collapse"
      class="vuedoc-example-collapse"
      :style="sourceStyles"
      @transitionend="onTransitionEnd"
    >
      <div
        class="vuedoc-example__source"
      >
        <pre><code
        class="hljs"
        v-html="sourceHtml"
        /></pre>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.vuedoc-example {
  border: 1px solid var(--vdoc-c-divider-light);
  &__content {
    padding: 16px;
  }
  &__source {
    font-size: 14px;
    padding-top: 0;
    pre {
      margin: 0;
    }
    code {
      padding: 0 16px 16px;
    }
  }
  &__actions {
    border-top: 1px solid var(--vdoc-c-divider-light);
    padding: 8px 16px;
  }
  &__action {
    padding: 0;
    margin: 0;
    display: inline-flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--vdoc-c-brand);
    font-weight: 600;
    &:hover {
      color: var(--vdoc-c-brand-light);
    }
    svg {
      margin-right: 4px;
      fill: currentColor;
      width: 22px;
      height: 22px;
      transition: transform .2s ease-in-out;
    }
    &--active svg {
      transform: rotate(90deg);
    }
  }
}
.vuedoc-example-collapse {
  overflow: hidden;
  transition: height .2s ease-in-out;
  will-change: height;
}
</style>
