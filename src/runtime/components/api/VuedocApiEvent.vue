<script lang="ts">
import {defineComponent, PropType} from 'vue'
import { decode } from 'html-entities';
import {EventDescriptor} from "vue-docgen-api";

export default defineComponent({
  name: "VuedocApiEvent",
  props: {
    value: {
      type: Object as PropType<EventDescriptor>,
      required: true,
    },
  },
  computed: {
    params() {
      let value = this.value.properties?.map((prop) => {
        const propType = prop.type.names.join(' | ');
        let str = `<code><strong>${prop.name}</strong>: ${propType || 'any'}</code>`;
        if (prop.description && typeof prop.description === 'string') {
          str = `${str}<br />${prop.description}`;
        }
        return `<p>${str}</p>`
      })
      // const mapFn = (item: string) => this.value.type?.name === 'string' ? `'${item}'` : item;
      // if (this.value.type?.name === 'union' && Array.isArray((this.value.type as any)?.elements)) {
      //   value = (this.value.type as any)?.elements.map((item: any) => mapFn(item.name)).join(' | ');
      // } else if (this.value.values) {
      //   value = this.value.values.map((item) => mapFn(item)).join(' | ');
      // }
      // if (!value) return null;
      return decode(value?.join(''));
    },
    deprecated() {
      return this.value.tags?.find((tag) => tag.title === 'deprecated');
    },
    computedDescription() {
      const arr = [];
      if (this.value.description) {
        arr.push(this.value.description);
      }

      const sinceTag = this.value.tags?.find((tag) => tag.title === 'since');
      if (sinceTag && (sinceTag as any).content) {
        arr.push(`<p>Since: ${(sinceTag as any).content}</p>`);
      }

      if (this.deprecated) {
        if ((this.deprecated as any).content) {
          arr.push(`<p>Deprecated: ${(this.deprecated as any).content}</p>`);
        } else {
          arr.push(`<p>Deprecated.</p>`);
        }
      }
      return arr.join('');
    },
    computedClasses() {
      return {
        'vuedoc-c-api-event--deprecated': !!this.deprecated,
      }
    },
  }
})
</script>

<template>
  <tr
    class="vuedoc-c-api-table__row vuedoc-c-api-event"
    :class="computedClasses"
  >
    <td><code>{{ value.name }}</code></td>
    <td v-html="computedDescription" />
    <td v-html="params"></td>
  </tr>
</template>

<style lang="scss">
.vuedoc-c-api-event {
  &--deprecated {
    td:first-child code {
      opacity: .5;
      text-decoration: line-through;
    }
  }
  td:nth-child(2), td:nth-child(3) {
    p + p {
      padding-top: 8px;
    }
  }
}
</style>
