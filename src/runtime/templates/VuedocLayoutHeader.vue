<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VuedocLayoutHeader',
  emits: ['toggle-sidebar'],
  data() {
    return {
      github: JSON.parse('<%= options.github %>')
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    }
  }
})
</script>

<template>
  <header class="vuedoc-header">
    <div class="vuedoc-header-wrap">
      <div class="container">
        <button
          class="vuedoc-header__menu"
          @click="toggleSidebar"
        >
          <vuedoc-icon-menu />
        </button>
        <a
          href="#"
          class="vuedoc-header-logo"
        >
          <vuedoc-logo class="vuedoc-header-logo__logo" />
          <span class="vuedoc-header-logo__text">NuxtVueDoc</span>
        </a>
        <div class="vuedoc-header__social">
          <a
            v-if="github"
            :href="github"
            target="_blank"
          >
            <vuedoc-icon-github />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
