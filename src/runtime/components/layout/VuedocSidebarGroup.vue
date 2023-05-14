<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VuedocSidebarGroup',
  props: {
    value: {
      type: Object,
      required: true,
    }
  },
emits: ['link-click'],
  methods: {
    onLinkClick() {
      this.$emit('link-click');
    }
  },
});
</script>

<template>
  <div class="vuedoc-sidebar-group">
    <strong class="vuedoc-sidebar-group__title">
      {{ value.title }}
    </strong>
    <vuedoc-sidebar-link
      v-for="(link, i) in value.items"
      :key="i"
      :link="link"
      @click="onLinkClick"
    />
  </div>
</template>

<style lang="scss">
@import "../../styles/variables.scss";
@import "../../styles/mixins.scss";

.vuedoc-sidebar-group {
  &__title {
    padding: 6px 0;
    display: block;
    line-height: 20px;
    font-size: 13px;
    font-weight: 600;
    color: var(--vdoc-c-text-1);
    transition: color .5s;
    @include responsive($vdoc-bp-md) {
      padding: 4px 0;
    }
  }
}

.vuedoc-sidebar-group + .vuedoc-sidebar-group,
.vuedoc-sidebar-link + .vuedoc-sidebar-group {
  padding-top: 24px;
  @include responsive($vdoc-bp-md) {
    padding-top: 16px;
  }
}
</style>
