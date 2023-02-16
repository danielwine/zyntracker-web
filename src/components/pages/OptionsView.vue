<script lang="ts">
import { useUIStore } from "@/stores/ui";
import { Panels } from "@/stores/model";
import { defineComponent } from "vue";
import PanelHeader from "@/components/elements/PanelHeader.vue";

export default defineComponent({
  setup() {
    const ui = useUIStore();
    return {
      ui,
      Panels,
    };
  },
  mounted() {
    this.ui.activePanel = Panels.options;
  },
  components: { PanelHeader },
});
</script>

<template>
  <PanelHeader title="Options" :id="Panels.options"></PanelHeader>
  <div class="p-4">
    <h4 class="mb-4">General options</h4>
    <p>Master volume</p>
    <p>Autostart transport on startup</p>
    <!-- <h4>Specific options</h4> -->
    <!-- <p></p> -->
  </div>
</template>
