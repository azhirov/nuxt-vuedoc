<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {PropDescriptor} from "vue-docgen-api";
import { decode } from 'html-entities';

export default defineComponent({
  name: "VuedocApiProp",
  props: {
    value: {
      type: Object as PropType<PropDescriptor>,
      required: true,
    },
  },
  computed: {
    values() {
      let value = null;
      const mapFn = (item: string) => this.value.type?.name === 'string' ? `'${item}'` : item;
      if (this.value.type?.name === 'union' && Array.isArray((this.value.type as any)?.elements)) {
        value = (this.value.type as any)?.elements.map((item: any) => mapFn(item.name)).join(' | ');
      } else if (this.value.values) {
        value = this.value.values.map((item) => mapFn(item)).join(' | ');
      }
      if (!value) return null;
      return decode(value);
    },
    isDeprecated() {
      return !!this.value.tags?.deprecated
    },
    computedDescription() {
      const arr = [];
      if (this.value.description) {
        arr.push(this.value.description);
      }

      if (this.values) {
        arr.push(`<p>Values: <code>${this.values}</code></p>`)
      }

      if (this.value.tags?.example) {
        const exampleTags = this.value.tags?.example
          .filter((item) => (item as any).description && typeof (item as any).description === "string")
          .map((item: any) => `<p>Example: <code>${item.description}</code></p>`);
        if (exampleTags) {
          arr.push(...exampleTags);
        }
      }

      if (this.value.tags?.since) {
        const version = this.value.tags.since.find((item: any) => !!item.description && typeof item.description === 'string');
        if (version) {
          arr.push(`<p>Since: ${(version as any).description}</p>`);
        }
      }

      if (this.isDeprecated) {
        const deprecatedTags = this.value.tags?.deprecated
          .filter((item) => (item as any).description && typeof (item as any).description === "string")
          .map((item: any) => `<p>Deprecated: ${item.description}</p>`);
        if (deprecatedTags?.length) {
          arr.push(...deprecatedTags);
        } else {
          arr.push(`<p>Deprecated.</p>`);
        }
      }
      return arr.join('');
    },
    computedType() {
      if (!this.value.type?.name) return null;
      return decode(this.value.type?.name);
    },
    computedClasses() {
      return {
        'vuedoc-c-api-prop--required': this.value.required,
        'vuedoc-c-api-prop--deprecated': this.isDeprecated,
      }
    },
  }
})
</script>

<template>
  <tr
    class="vuedoc-c-api-table__row vuedoc-c-api-prop"
    :class="computedClasses"
  >
    <td><code>{{ value.name }}</code></td>
    <td v-html="computedDescription" />
    <td><code v-if="computedType">{{ computedType }}</code></td>
    <td>
      <code
        v-if="value.defaultValue"
        v-html="value.defaultValue.value"
      />
    </td>
  </tr>
</template>

<style lang="scss">
.vuedoc-c-api-prop {
  &--required td:first-child {
    &::before {
      content: '*';
      color: red;
      display: inline-block;
      padding-right: 4px;
      font-family: monospace, monospace;
      margin-left: -11px;
    }
  }
  &--deprecated {
    td:first-child code {
      opacity: .5;
      text-decoration: line-through;
    }
  }
  td:nth-child(2) {
    p + p {
      padding-top: 8px;
    }
  }
}
</style>
