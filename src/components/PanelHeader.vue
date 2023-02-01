<script lang="ts">
import { useUIStore } from "@/stores/ui";
import type { Panels } from "@/stores/model";
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
    class="panel-header"
    :class="
      ui.activePanel == id ? 'panel-header-active' : 'panel-header-inactive'
    "
    @click="setState"
  >
    <span class="panel-header-title">
      {{ title }}
      <slot name="option"></slot>
    </span>
    <div class="panel-header-control">
      <slot name="control"></slot>
    </div>
  </div>
</template>

<style>
.panel-header {
  margin-bottom: 0.8em;
  height: 3.1em;
}

.panel-header-title {
  position: absolute;
  padding: 0.75em 1.8em 0.75em 1.15em;
}

.panel-header-active {
  background-color: #474;
}

.panel-header-inactive {
  color: white;
  background-color: #555;
}

.panel-header-control {
  position: absolute;
  right: 0.5em;
  top: 0.25em;
}
</style>
