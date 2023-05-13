<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VuedocSidebar',
  props: {
    isActive: Boolean,
  },
  data() {
    return {
      links: JSON.parse(`<%= JSON.stringify(options.links) %>`),
    }
  },
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
        />
        <vuedoc-sidebar-group
          v-else-if="item.title"
          :key="`group-${i}`"
          :to="item.to"
          :value="item"
        />
      </template>
    </nav>
  </aside>
</template>
