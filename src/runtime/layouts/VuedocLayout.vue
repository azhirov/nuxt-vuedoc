<script lang="ts">
import { defineComponent } from 'vue'
/* Do not import components in this file! */

export default defineComponent({
  name: 'VuedocLayout',
  components: {
  },
  data() {
    return {
      isSidebarActive: false,
    }
  },
  head() {
    return {
      htmlAttrs: {
        class: 'vuedoc',
      }
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarActive = !this.isSidebarActive;
    }
  }
})
</script>

<template>
  <vuedoc-styles-provider>
    <div class="vuedoc-layout">
      <transition name="vuedoc-overlay">
        <div
          v-show="isSidebarActive"
          class="vuedoc-overlay"
          @click="toggleSidebar"
        />
      </transition>
      <vuedoc-layout-header @toggle-sidebar="toggleSidebar" />
      <vuedoc-sidebar
        :is-active="isSidebarActive"
        @close="isSidebarActive = false"
      />
      <div class="vuedoc-content-wrapper">
        <div class="vuedoc-content">
          <div class="container">
            <Nuxt />
          </div>
        </div>
      </div>
    </div>
  </vuedoc-styles-provider>
</template>
