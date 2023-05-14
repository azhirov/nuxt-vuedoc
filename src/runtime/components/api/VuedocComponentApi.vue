<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { ComponentDoc } from 'vue-docgen-api';

export default defineComponent({
  name: 'VuedocComponentApi',
  props: {
    value: {
      type: Object as PropType<ComponentDoc>,
      required: true,
    },
  },
});
</script>

<template>
  <div class="vuedoc-c-api">
    <h2
      id="props"
      tabindex="-1"
    >
      Props
    </h2>
    <table class="vuedoc-c-api-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Type</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="prop in value.props"
          :key="prop.name"
          class="vuedoc-c-api-table__row"
          :class="{'vuedoc-c-api-table__row--required': prop.required}"
        >
          <td><code>{{ prop.name }}</code></td>
          <td v-html="prop.description" />
          <td><code v-if="prop.type">{{ prop.type.name === 'union' && prop.type.elements ? prop.type.elements.map((item) => item.name).join(' | ') : prop.type.name }}</code></td>
          <td>
            <code
              v-if="prop.defaultValue"
              v-html="prop.defaultValue.value"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.vuedoc-c-api {

}
.vuedoc-c-api-table {
  width: 100%;
  font-size: 14px;
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
  line-height: 1.5714285714285714;
  border: 1px solid rgba(5, 5, 5, 0.06);
  border-width: 0 1px;
  border-collapse: collapse;
  tr { vertical-align: middle; }
  td, th {
    border-top: 1px solid rgba(5, 5, 5, 0.06);
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
    padding: 0.6rem 1rem;
    text-align: left;
    max-width: 250px;
    vertical-align: middle;
    &:first-child {
      padding-left: 1.2rem;
    }
    p {
      margin: 0;
    }
  }
  &__row--required td:first-child {
    &::before {
      content: '*';
      color: red;
      display: inline-block;
      padding-right: 4px;
      font-family: monospace, monospace;
      margin-left: -11px;
    }
  }
}
</style>
