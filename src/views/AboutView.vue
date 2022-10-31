<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    window.addEventListener("keydown", this.keyDown);
  },
  unmounted() {
    window.removeEventListener("keydown", this.keyDown);
  },
  methods: {
    keyDown(event: KeyboardEvent) {
        if (event.key == "Escape" || event.key == "F1") {
            this.$router.go(-1)
        }
    }
  }
})
</script>

<template>
  <div class="p-4">
    <h1>ZynTracker</h1>
    <p>
      ZynTracker v0.0.1 is an
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
    <p>Version 0.0.1 implements:
        <ul>
            <li>Loading snapshot files containing sequence data</li>
            <li>Playing back patterns using a simple synth engine or a sampler (SFZ)</li>
            <li>Pattern editor interface</li>
        </ul>
    </p>
    <p>The application is intended for use with computers with a keyboard. Keymap is similar to Renoise.</p> 
    <p>Zyntracker is in the early stages of development (alpha), the code base and available features may change rapidly.</p>
    <p>(C) 2022 by danielwine</p>
  </div>
</template>
