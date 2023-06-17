# Group page

Markdown can contain `script` block and vue components

<button-primary color="blue">Primary button</button-primary>

<script lang="ts">
import {defineComponent} from "vue"; 
import ButtonPrimary from "@comp/Button/ButtonPrimary.vue";

export default defineComponent({
  components: { ButtonPrimary },
});
</script>
