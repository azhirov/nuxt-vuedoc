<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VuedocSidebarLink',
  props: {
    link: {
      type: Object,
      required: true,
    }
  },
  render(h) {
    const link: any = this.link;
    if (!link) { return null }
    const titleEl = h('span', {
      staticClass: 'vuedoc-sidebar-link__text'
    }, [link.title]);

    if (link.to) {
      return h('nuxt-link', {
        staticClass: 'vuedoc-sidebar-link',
        props: {
          to: link.to,
          activeClass: 'vuedoc-sidebar-link--is-active',
          exactActiveClass: 'vuedoc-sidebar-link--is-active',
        }
      }, [titleEl]);
    }
    if (link.href) {
      return h('a', {
        staticClass: 'vuedoc-sidebar-link',
        domProps: {
          href: link.href,
        },
      }, [titleEl]);
    }
    return null;
  }
})
</script>

<style lang="scss">
@import "../../styles/variables.scss";
@import "../../styles/mixins.scss";

.vuedoc-sidebar-link {
  $el: &;
  display: block;
  padding: 6px 0;
  text-decoration: none;

  @include responsive($vdoc-bp-md) {
    padding: 4px 0;
  }

  &__text {
    line-height: 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--vdoc-c-text-2);
    transition: color .5s;
  }
  &:hover &__text {
    color: var(--vdoc-c-text-1);
    transition: color .25s;
  }
  &--is-active#{$el} &__text {
    font-weight: 600;
    color: var(--vdoc-c-brand);
    transition: color .25s;
  }

}
</style>
