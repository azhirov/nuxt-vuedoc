<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { EventDescriptor, MethodDescriptor, PropDescriptor, SlotDescriptor} from 'vue-docgen-api';

export default defineComponent({
  name: 'VuedocComponentApi',
  props: {
    props: {
      type: Array as PropType<PropDescriptor[]>,
      default: () => [],
    },
    events: {
      type: Array as PropType<EventDescriptor[]>,
      default: () => [],
    },
    slots: {
      type: Array as PropType<SlotDescriptor[]>,
      default: () => [],
    },
    methods: {
      type: Array as PropType<MethodDescriptor[]>,
      default: () => [],
    },
  },
});
</script>

<template>
  <div class="vuedoc-c-api">
    <h2
      id="api-props"
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
        <vuedoc-api-prop
          v-for="prop in props"
          :key="prop.name"
          :value="prop"
        />
      </tbody>
    </table>
    <h2
      id="api-events"
      tabindex="-1"
    >
      Events
    </h2>
    <table class="vuedoc-c-api-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Params</th>
        </tr>
      </thead>
      <tbody>
        <vuedoc-api-event
          v-for="event in events"
          :key="event.name"
          :value="event"
        />
      </tbody>
    </table>
    <h2
      id="api-slots"
      tabindex="-1"
    >
      Slots
    </h2>
    <table class="vuedoc-c-api-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Params</th>
        </tr>
      </thead>
      <tbody>
        <vuedoc-api-slot
          v-for="slot in slots"
          :key="slot.name"
          :value="slot"
        />
      </tbody>
    </table>
    <h2
      id="api-public-methods"
      tabindex="-1"
    >
      Public methods
    </h2>
    <table class="vuedoc-c-api-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Params</th>
        </tr>
      </thead>
      <tbody>
        <vuedoc-api-method
          v-for="method in methods"
          :key="method.name"
          :value="method"
        />
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
