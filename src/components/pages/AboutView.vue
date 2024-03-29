<script lang="ts">
import { useUIStore } from "@/stores/ui";
import { Panels } from "@/stores/model";
import { defineComponent } from 'vue';
import PanelHeader from "@/components/elements/PanelHeader.vue";
import { appInfo } from "@/composables/config";

export default defineComponent({
    setup() {
        const ui = useUIStore();
        return {
            ui,
            Panels,
            appName: appInfo.name, 
            author: appInfo.author, version: appInfo.version
        };
    },
    mounted() {
        this.ui.activePanel = Panels.help;
    },
    components: { PanelHeader }
})
</script>

<template>
    <PanelHeader title="About" :id="Panels.help"></PanelHeader>
    <div class="p-4">
      <h4>About</h4>
      <p>
        {{ appName }} is an
        <strong>online sequence manipulator, musical sketchpad</strong>
        and player compatible with the MIDI sequencer "ZynSeq" written in C++ by
        <em>Brian Walton</em> for the
        <a href="https://zynthian.org"
          ><strong>Zynthian Open Synth Platform</strong></a
        >
        (created by <em>Jośe Fernando Moyano</em>) which is targeting the
        Raspberry Pi single-board computer.
      </p>
      <p>
        The application can natively read <code>ZSS snapshot files</code>
        (along with the encoded binary <code>RIFF</code> sequence data) and
        convert the extracted patterns into ToneJS sequences that can be played
        back (and edited) using the <code>Web Audio / ToneJS API</code>.
      </p>
      <h4>Keyboard shortcuts</h4>
      <p>The application is intended <strong>for use with computers with a 
        keyboard</strong> (keymap is similar to Renoise). </p>
      <p></p>
      <h4>Project state</h4>
      <p>Currently (v{{ version }}) implemented:
          <ul>
              <li>Loading snapshot files containing sequence data</li>
              <li>Playing back patterns using a simple tone.js synth or sampler (SFZ)</li>
              <li>Zynpad and pattern editor interface</li>
          </ul>
      </p>
         <p><em>The project is in the early stages of development, the code base and 
          available features may change rapidly.</em></p>
      <p>(C) 2022-2023 by {{ author }}</p>
    </div>
</template>
