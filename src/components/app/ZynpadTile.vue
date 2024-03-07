<script lang="ts">
import { AudioService } from "@/library/core/audio";
import { defineComponent } from "vue";
import { useUIStore } from "@/stores/ui";
import { PlayStates } from "@/stores/model";
import { isNumber } from "tone";

export default defineComponent({
  props: ["selected", "sequence"],
  setup() {
    const ui = useUIStore();
    return {
      ui,
    };
  },
  emits: ["editRequest"],
  data() {
    return {
      audioService: AudioService.getInstance(),
      playMode: "loopall",
      clickInterval: false as boolean | number,
      clickCount: 0,
    };
  },
  methods: {
    clickStart() {
      if (!this.clickInterval) {
        this.clickInterval = window.setInterval(() => this.clickCount++, 30);
      }
    },
    clickStop() {
      if (isNumber(this.clickInterval)) {
        if (this.clickCount < 28) this.togglePlay();
        clearInterval(this.clickInterval);
        this.clickCount = 0;
        this.clickInterval = false;
      }
    },
    togglePlay() {
      let active = this.audioService.getActiveSequenceByGroup(
        this.sequence.group
      );
      if (this.ui.isPadActive[this.sequence.id] != PlayStates.playing) {
        if (active && active.meta.id) {
          console.log(this.sequence.id, active.meta.id);
          this.ui.isPadActive[active.meta.id] = PlayStates.stopped;
          this.audioService.stopSequence(active.meta.id - 1);
        }
        this.ui.isPadActive[this.sequence.id] = PlayStates.playing;
        this.ui.selectedPad = this.sequence.id;
        this.ui.currentPattern = this.sequence.id - 1;
        this.audioService.startSequence(this.sequence.id - 1);
      } else {
        this.ui.isPadActive[this.sequence.id] = PlayStates.stopped;
        this.audioService.stopSequence(this.sequence.id - 1);
      }
    },
  },
  computed: {
    firstPatternID() {
      return this.sequence.getFirstPatternID();
    },
    playStateString() {
      let st = this.ui.isPadActive[this.sequence.id];
      if (st == PlayStates.stopped) return "";
      if (st == PlayStates.playing) return "playing";
    },
    playState(): string {
      return this.ui.isPadActive[this.sequence.id] ? "playing" : "";
    },
    playModeUrl() {
      return new URL(
        `../../assets/images/mode_${this.playMode}.png`,
        import.meta.url
      ).href;
    },
    playStateUrl() {
      return new URL(
        `../../assets/images/state_${this.playStateString}.png`,
        import.meta.url
      ).href;
    },
    groupCode() {
      return String.fromCharCode(65 + this.sequence.group);
    },
  },
  watch: {
    clickCount() {
      if (this.clickCount == 28) {
        this.ui.selectedPad = this.sequence.id;
        this.ui.currentPattern = this.sequence.id - 1;
        this.$emit("editRequest");
      }
    },
  },
});
</script>
<template>
  <div
    class="tile"
    :class="`${selected == 'true' ? 'tile-selected' : ''}`"
    @mousedown="clickStart"
    @mouseleave="clickStop"
    @mouseup="clickStop"
    @touchstart="clickStart"
    @touchend="clickStop"
    @touchcancel="clickStop"
  >
    <div id="innerContent">
      <div class="tile-header" :class="`group-header-${sequence.group}`">
        <!-- <div class="row"> -->
        <span>
          <img class="playmode" :src="playModeUrl" alt="" />
          <pre class="channel">CH{{ sequence.group + 1 }}</pre>
          <pre class="group"> {{ groupCode }}{{ sequence.id }}</pre>
          <span class="playstate">
            <img v-if="playState" :src="playStateUrl" alt="" />
          </span>
        </span>
        <!-- </div> -->
      </div>
      <div class="tile-body" :class="`group-body-${sequence.group}`">
        {{ sequence.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  /* font-family: "Audiowide"; */
  user-select: none;
  width: 25%;
  height: 10vh;
  color: #fff;
  border: 1px solid black;
}

.tile:hover,
.tile-selected {
  filter: brightness(1.1);
  border: 1px solid red;
}
.tile-active {
  border: 1px solid white;
}

.tile-header {
  height: 31%;
}

.tile-header-row {
  display: block;
}

.channel {
  margin-left: 5px;
  margin-right: 5px;
}

.tile-body {
  /* font-family: "Audiowide"; */
  height: 72%;
  padding-top: 5px;
  padding-left: 5px;
}

.tile-header pre {
  display: inline;
}

.tile-header .playstate {
  margin-right: 15px;
  float: right;
}

.tile-header .playstate img {
  height: 14px;
  width: 14px;
}

#innerContent {
  /* font-size: 1.05em; */
  height: 100%;
  top: 1px;
  bottom: 2px;
}

.tile {
  filter: brightness(0.9) contrast(1.4);
  /* filter: brightness(0.9) contrast(1.3); */
}

.tile-body {
}
.group-header-0 {
  background-color: #662426;
}
.group-body-0 {
  background-color: #8e4c4e;
}

.group-header-1 {
  background-color: #3c6964;
}

.group-body-1 {
  background-color: #64918c;
}

.group-header-2 {
  background-color: #4d6817;
}

.group-body-2 {
  background-color: #75903f;
}

.group-header-3 {
  background-color: #664980;
}

.group-body-3 {
  background-color: #8e71a8;
}

.group-header-4 {
  background-color: #4c709a;
}

.group-body-4 {
  background-color: #7498c2;
}

.group-header-5 {
  background-color: #4c94cc;
}

.group-body-5 {
  background-color: #74bcf4;
}

.group-header-6 {
  background-color: #006000;
}

.group-body-6 {
  background-color: #288828;
}

.group-header-7 {
  background-color: #b7aa5e;
}

.group-body-7 {
  background-color: #dfd286;
}

.group-header-8 {
  background-color: #996633;
}

.group-body-8 {
  background-color: #c18e5b;
}

.group-header-9 {
  background-color: #746360;
}

.group-body-9 {
  background-color: #9c8b88;
}

.group-header-10 {
  background-color: #d07272;
}

.group-body-10 {
  background-color: #f89a9a;
}

.group-header-11 {
  background-color: #000060;
}

.group-body-11 {
  background-color: #282888;
}

.group-header-12 {
  background-color: #048c8c;
}

.group-body-12 {
  background-color: #2cb4b4;
}
.group-header-13 {
  background-color: #f46815;
}

.group-body-13 {
  background-color: #ff903d;
}

.group-header-14 {
  background-color: #bf9c7c;
}

.group-body-14 {
  background-color: #e7c4a4;
}

.group-header-15 {
  background-color: #56a556;
}

.group-body-15 {
  background-color: #7ecd7e;
}

@media screen and (min-width: 1500px) {
  .tile-header .playmode {
    margin-top: 2px;
    margin-left: 4px;
    width: 32px;
    height: 16px;
  }
}

@media screen and (max-width: 1499.999px) {
  .tile-header .playmode {
    /* width: 50%; */
    height: 16px;
  }
  .group {
    display: none;
  }
}

@media screen and (max-width: 1699.999px) {
  .tile-header .channel {
    display: none;
  }
  .tile-body {
    font-size: 0.9em;
  }
}
@media screen and (max-width: 1139.999px) {
  .tile-header .playmode {
    width: 32px;
    height: 14px;
  }
  .group {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .tile {
    width: 150px;
    height: 10vh;
  }
}
</style>
