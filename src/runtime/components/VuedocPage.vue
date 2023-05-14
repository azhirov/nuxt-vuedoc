<template>
  <div class="docs-page-wrapper">
    <div class="page-content">
      <component :is="pageName" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DocsPage',
  layout: 'vuedoc',
  props: {
    pageName: {
      type: String,
      required: true,
    },
    frontmatter: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  head() {
    if (!this.frontmatter) return {};
    return {
      title: this.frontmatter.title,
    }
  },
  methods: {

  },
})
</script>
