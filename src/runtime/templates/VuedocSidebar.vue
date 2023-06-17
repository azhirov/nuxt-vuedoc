<script lang="ts">
import { defineComponent } from 'vue'
import type { VuedocNav } from '../../types';

export default defineComponent({
  name: 'VuedocSidebar',
  props: {
    isActive: Boolean,
  },
emits: ['close'],
  data() {
    return {
      links: JSON.parse(`<%= JSON.stringify(options.links) %>`) as VuedocNav,
    }
  },
  methods: {
    onLinkClick() {
      this.$emit('close');
    }
  }
})
</script>

<template>
  <aside
    class="vuedoc-sidebar"
    :class="{'vuedoc-sidebar--is-active': isActive}"
  >
    <nav class="vuedoc-sidebar-nav">
      <template
        v-for="(item, i) in links"
      >
        <vuedoc-sidebar-link
          v-if="item.to || item.href"
          :key="`link-${i}`"
          :link="item"
          @click="onLinkClick"
        />
        <vuedoc-sidebar-group
          v-else-if="item.title"
          :key="`group-${i}`"
          :to="item.to"
          :value="item"
          @link-click="onLinkClick"
        />
      </template>
    </nav>
  </aside>
</template>
