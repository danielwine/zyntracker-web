<script lang="ts">
import { useUIStore } from "@/stores/ui";
import { Panels } from "@/stores/model";
import { defineComponent } from "vue";
import PanelHeader from "@/components/elements/PanelHeader.vue";
import BsSlider from "../elements/BsSlider.vue";
import BsSwitch from "../elements/BsSwitch.vue";
import OptionsItem from "../elements/OptionsItem.vue";

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
  components: { PanelHeader, BsSlider, BsSwitch, OptionsItem },
});
</script>

<template>
  <PanelHeader title="Options" :id="Panels.options"></PanelHeader>
  <div class="p-4">
    <h4 class="mb-2">General options</h4>
    <h6 class="mb-4 text-muted">(under development)</h6>

    <OptionsItem
      label="Master volume"
      id="master-volume"
      :value="70"
    ></OptionsItem>
    <OptionsItem
      label="Autostart transport on startup"
      id="autostart-transport"
      :value="true"
    ></OptionsItem>
    <OptionsItem
      label="Replace original synth engines with samples classified as possibly similar (instead of using primitive web synthesis)" 
      id="use-samples"
      :value="false"
    ></OptionsItem>

    <!-- <h4>Specific options</h4> -->
    <!-- <p></p> -->
  </div>
</template>
