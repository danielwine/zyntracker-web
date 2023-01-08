<script lang="ts">
import { AudioService } from "@/library/core/AudioService";
import { defineComponent } from "vue";
import { useUIStore, PlayStates } from "@/stores/ui";
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
        `../assets/images/state_${this.playMode}.png`,
        import.meta.url
      ).href;
    },
    playStateUrl() {
      return new URL(
        `../assets/images/state_${this.playStateString}.png`,
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
    :class="`group-${sequence.group} ${
      selected == 'true' ? 'tile-selected' : ''
    }`"
    @mousedown="clickStart"
    @mouseleave="clickStop"
    @mouseup="clickStop"
    @touchstart="clickStart"
    @touchend="clickStop"
    @touchcancel="clickStop"
  >
    <div id="innerContent">
      <div class="tile-header">
        <pre>{{ sequence.name }}</pre>
      </div>
      <div class="tile-footer">
        <pre class="group"> {{ groupCode }}</pre>
        <img class="playmode" :src="playModeUrl" alt="" />
        <span class="playstate">
          <img :src="playStateUrl" alt="" />
        </span>
        <!-- <pre>{{ sequence.playMode }}</pre> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile {
  user-select: none;
  width: 150px;
  height: 11vh;
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
  background-color: black;
}

.tile-header pre,
.tile-footer pre {
  overflow: hidden;
  font-size: 0.84em;
}

.tile-footer {
  position: absolute;
  display: flex;
  gap: 0.9em;
  left: 2%;
  top: 50%;
}

.tile-footer .playstate {
  margin-top: -4px;
  height: 16px;
  width: 16px;
}

#innerContent {
  position: absolute;
  left: 3px;
  right: 3px;
  top: 3px;
  bottom: 3px;
  font-size: 1.1em;
  text-align: center;
  font-weight: bolder;
}

pre.group {
  font-size: 1em;
}
.group-0 {
  background-color: #1b0157;
}

.group-1 {
  background-color: #018680;
}

.group-2 {
  background-color: #9b5a28;
}

.group-3 {
  background-color: #c601c4;
}

.group-4 {
  background-color: burlywood;
}
.group-5 {
  background-color: #8d985d;
}
.group-6 {
  background-color: #ff27ae;
}
.group-7 {
  background-color: #d8765b;
}
.group-8 {
  background-color: darkblue;
  /* background-color: darkolivegreen; */
}
.group-9 {
  background-color: #cb01c8;
}

@media screen and (min-width: 1500px) {
  .tile-footer {
    gap: 0.9em;
    left: 5%;
    top: 50%;
  }
  .tile-footer .playmode {
    margin-top: 4px;
    width: 40%;
    height: 16px;
  }
}

@media screen and (max-width: 1499.999px) {
  .tile-footer {
    gap: 0.9em;
    left: 20%;
    top: 50%;
  }
  .tile-footer .playmode {
    margin-top: 4px;
    width: 50%;
    height: 16px;
  }
  .group {
    display: none;
  }
}
@media screen and (max-width: 1139.999px) {
  .tile-footer {
    gap: 1em;
    left: 20%;
    top: 50%;
  }
  .tile-footer .playmode {
    margin-top: 4px;
    width: 50%;
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

@media screen and (min-width: 768px) and (max-width: 1499.999px) {
  .tile-header pre {
    font-size: 0.76em;
  }
}

@media screen and (min-width: 992px) and (max-width: 1199.999px) {
  .tile-header pre {
    font-size: 0.70em;
  }
}
</style>
