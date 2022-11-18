<script lang="ts">
import { useUIStore, type Panels } from "@/stores/ui";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    title: String,
    id: Number,
  },
  setup() {
    return { ui: useUIStore() };
  },
  methods: {
    setState(event: Event) {
      this.ui.activePanel =
        this.id != undefined && this.id != this.ui.activePanel
          ? this.id
          : this.ui.activePanel;
    },
  },
});
</script>

<template>
  <div
    class="block-label"
    :class="
      ui.activePanel == id ? 'block-label-active' : 'block-label-inactive'
    "
    @click="setState"
  >
    {{ title }}
    <span>
      <slot name="option"></slot>
    </span>
  </div>
</template>

<style>
.block-label {
  padding: 0.75em 1.8em 0.75em 1.8em;
  margin-bottom: 0.8em;
}

.block-label-active {
  background-color: #474;
}

.block-label-inactive {
  color: white;
  background-color: #555;
}
</style>
