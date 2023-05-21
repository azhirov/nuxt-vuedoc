<template>
  <div
    class="vuedoc-page-wrapper"
    :class="{'vuedoc-page-wrapper--has-toc': headers.length}"
  >
    <vuedoc-toc
      v-if="headers.length"
      :value="headers"
      :active="activeHeading"
    />
    <div
      ref="page"
      class="vuedoc-page-content"
    >
      <component :is="pageName" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import { VuedocTocItem } from '../../types'
import { throttleAndDebounce } from '../utils'

const PAGE_OFFSET = 55;

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
    headers: {
      type: Array as PropType<VuedocTocItem[]>,
      default: () => [],
    }
  },
  data() {
    return {
      observer: null as IntersectionObserver | null,
      activeHeading: null as string | null,
      onscroll: null as null | (() => void),
    };
  },
  head() {
    if (!this.frontmatter) return {};
    return {
      title: this.frontmatter.title,
    }
  },
  mounted() {
    this.onscroll = throttleAndDebounce(this.setActiveLink, 100);
    document.addEventListener('scroll', this.onscroll);
    this.onscroll();
  },
  beforeUnmount () {
    document.removeEventListener('scroll', this.onscroll!);
  },
  methods: {
    setActiveLink() {
      const scrollY = window.scrollY
      const innerHeight = window.innerHeight
      const offsetHeight = document.body.offsetHeight
      const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

      // page bottom - highlight last one
      if (this.headers.length && isBottom) {
        this.activeHeading = this.headers[this.headers.length - 1].id;
        return
      }

      for (let i = 0; i < this.headers.length; i++) {
        const anchor = this.headers[i];
        const nextAnchor = this.headers[i + 1];

        const [isActive, id] = this.isAnchorActive(i, anchor, nextAnchor)

        if (isActive) {
          this.activeHeading = id;
          return
        }
      }
    },
    getAnchorTop(anchor: VuedocTocItem): number {
      const el = document.getElementById(anchor.id);
      if (!el) return 0;
      const scrollMT = parseInt(getComputedStyle(el).scrollMarginTop);
      return el.offsetTop - scrollMT;
    },
    isAnchorActive(
      index: number,
      anchor: VuedocTocItem,
      nextAnchor: VuedocTocItem | undefined
    ): [boolean, string | null] {
      const scrollTop = window.scrollY

      if (index === 0 && scrollTop === 0) {
        return [true, null]
      }
      if (scrollTop < this.getAnchorTop(anchor)) {
        return [false, null]
      }

      if (!nextAnchor || scrollTop < this.getAnchorTop(nextAnchor)) {
        return [true, anchor.id]
      }

      return [false, null]
    }
  }
})
</script>

<style lang="scss">
@import "../styles/variables.scss";
@import "../styles/mixins.scss";

.vuedoc-page-wrapper {
  &:not(&--has-toc) {
    @include responsive($vdoc-bp-lg) {
      max-width: calc(var(--vdoc-screen-max-width) - var(--vdoc-sidebar-width-small) - 48px);
      padding-right: 48px;
      display: flex;
      justify-content: center;
    }
    @include responsive(1300px) {
      max-width: calc(var(--vdoc-screen-max-width) - var(--vdoc-sidebar-width-small) - 64px);
      padding-right: 64px;
    }
    @include responsive($vdoc-bp-xl) {
      max-width: calc(var(--vdoc-screen-max-width) - var(--vdoc-sidebar-width-small) - 96px);
      padding-right: 96px;
    }
  }
  &--has-toc {
    @include responsive($vdoc-bp-lg) {
      display: flex;
    }
  }
}
.vuedoc-page-content {
  margin: 0 auto;
  max-width: 688px;
  position: relative;
  width: 100%;
  @include responsive($vdoc-bp-lg) {
    min-width: 620px;
    margin: 0;
    order: 1;
  }
}
</style>
