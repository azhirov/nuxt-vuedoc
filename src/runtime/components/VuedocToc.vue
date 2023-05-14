<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { VuedocTocItem } from '../../types'

export default defineComponent({
  name: 'VuedocToc',
  props: {
    value: {
      type: Array as PropType<VuedocTocItem[]>,
      default: () => [],
    },
    active: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  data() {
    return {
      indicatorTop: 0,
    }
  },
  watch: {
    active: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.setIndicator();
        })
      }
    },
  },
  methods: {
    onClick({ target: el }: Event) {
      const id = (el as HTMLAnchorElement).href!.split('#')[1]
      const heading = document.getElementById(decodeURIComponent(id));
      heading?.focus()
    },
    setIndicator() {
      if (!this.active) return;
      if (process.server) return;
      const link = this.$el.querySelector('a.vuedoc-toc-link--is-active');
      const linkTop = (link as HTMLElement)?.offsetTop;
      const linkHeight = (link as HTMLElement)?.offsetHeight;
      const navTop = (this.$refs.nav as HTMLElement)?.offsetTop;
      this.indicatorTop = linkTop - navTop + (linkHeight - 20) / 2;
    }
  }
})
</script>

<template>
  <div class="vuedoc-toc">
    <div class="vuedoc-toc__container">
      <nav
        ref="nav"
        class="vuedoc-toc-nav"
      >
        <span
          class="vuedoc-toc-nav__indicator"
          :style="{ opacity: active ? 1 : 0, top: `${indicatorTop}px` }"
        />
        <ul class="vuedoc-toc-list">
          <li
            v-for="(heading, i) in value"
            :key="heading.id + '#' + i"
          >
            <a
              :href="`#${heading.id}`"
              class="vuedoc-toc-link"
              :class="{'vuedoc-toc-link--is-active': active === heading.id}"
              :title="heading.title"
              @click="onClick"
            >
              {{ heading.title }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style lang="scss">
@import "../styles/variables";
@import "../styles/mixins";

.vuedoc-toc {
  position: relative;
  display: none;
  flex-shrink: 0;
  padding-left: 64px;
  width: 320px;
  @include responsive($vdoc-bp-lg) {
    display: block;
    order: 2;
  }
  &__container {
    position: sticky;
    width: 224px;
    top: calc(var(--vdoc-header-height) + 24px);
    bottom: 0;
  }
}
.vuedoc-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.vuedoc-toc-nav {
  position: relative;
  &__indicator {
    opacity: 0;
    position: absolute;
    background-color: var(--vdoc-c-brand);
    border-radius: 4px;
    width: 4px;
    height: 20px;
    top: 0;
    left: -12px;
    z-index: 0;
    transition: top .25s cubic-bezier(0,1,.5,1),opacity .25s,background-color .5s;
  }
}
.vuedoc-toc-link {
  font-weight: 500;
  font-size: 13px;
  color: var(--vdoc-c-text-2);
  text-decoration: none;
  transition: color .5s;
  line-height: 28px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    color: var(--vdoc-c-text-1);
    transition: color .25s;
  }
  &--is-active {
    color: var(--vdoc-c-brand);
  }
}
</style>
