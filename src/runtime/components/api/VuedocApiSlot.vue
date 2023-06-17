<script lang="ts">
import {defineComponent, PropType} from 'vue'
import { decode } from 'html-entities';
import { SlotDescriptor } from "vue-docgen-api";

export default defineComponent({
  name: "VuedocApiSlot",
  props: {
    value: {
      type: Object as PropType<SlotDescriptor>,
      required: true,
    },
  },
  computed: {
    params() {
      const value = this.value.bindings?.map((prop) => {
        const propType = prop.type?.name || 'any';
        let str = `<code><strong>${prop.name}</strong>: ${propType}</code>`;
        if (prop.description && typeof prop.description === 'string') {
          str = `${str}<br />${prop.description}`;
        }
        return `<p>${str}</p>`
      })
      if (!value) return null;
      return decode(value?.join(''));
    },
    deprecated() {
      return this.value.tags?.deprecated?.[0];
    },
    computedDescription() {
      const arr = [];
      if (this.value.description) {
        arr.push(this.value.description);
      }

      const sinceTag = this.value.tags?.since?.[0];
      if (sinceTag && (sinceTag as any).description) {
        arr.push(`<p>Since: ${(sinceTag as any).description}</p>`);
      }

      if (this.deprecated) {
        if ((this.deprecated as any).description) {
          arr.push(`<p>Deprecated: ${(this.deprecated as any).description}</p>`);
        } else {
          arr.push(`<p>Deprecated.</p>`);
        }
      }
      return arr.join('');
    },
    computedClasses() {
      return {
        'vuedoc-c-api-slot--deprecated': !!this.deprecated,
      }
    },
  }
})
</script>

<template>
  <tr
    class="vuedoc-c-api-table__row vuedoc-c-api-slot"
    :class="computedClasses"
  >
    <td><code>{{ value.name }}</code></td>
    <td v-html="computedDescription" />
    <td v-html="params" />
  </tr>
</template>

<style lang="scss">
.vuedoc-c-api-slot {
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
