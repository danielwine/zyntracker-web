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
      label="Note scheduling delay (lookahead)"
      id="note-scheduling"
      :value="0"
    ></OptionsItem>
    <OptionsItem
      label="Autostart transport on startup"
      id="autostart-transport"
      :value="true"
    ></OptionsItem>
    <OptionsItem
      label="Try to use samples from a limited sample library instead of web synthesis" 
      id="use-samples"
      :value="true"
    ></OptionsItem>

    <!-- <h4>Specific options</h4> -->
    <!-- <p></p> -->
  </div>
</template>
