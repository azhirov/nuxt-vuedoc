<script lang="ts">
import {defineComponent, h, resolveComponent} from 'vue'

export default defineComponent({
  name: 'VuedocSidebarLink',
  props: {
    link: {
      type: Object,
      required: true,
    }
  },
  emits: ['click'],
  render() {
    const link: any = this.link;
    if (!link) { return null }
    const titleEl = h('span', {
      class: 'vuedoc-sidebar-link__text'
    }, [link.title]);

    const on = {
      click: () => {
        this.$emit('click');
      }
    }

    if (link.to) {
      const linkComponent = resolveComponent('NuxtLink');
      return h(linkComponent, {
        class: 'vuedoc-sidebar-link',
        to: link.to,
        activeClass: 'vuedoc-sidebar-link--is-active',
        exactActiveClass: 'vuedoc-sidebar-link--is-active',
        exactPath: true,
        nativeOn: on,
      }, () => [titleEl]);
    }
    if (link.href) {
      return h('a', {
        class: 'vuedoc-sidebar-link',
        href: link.href,
        on,
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
