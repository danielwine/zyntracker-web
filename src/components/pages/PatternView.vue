<script lang="ts">
import { defineComponent, nextTick, ref } from "vue";
import { useMainStore } from "@/stores/zss";
import { useUIStore } from "@/stores/ui";
import { Panels } from "@/stores/model";
import { storeToRefs } from "pinia";

import { debug } from '@/composables/config'
import { AudioService } from "@/library/core/audio";
import type { ToneSequenceEvents } from "@/library/core/model/pattern";
import * as keymap from "@/library/core/res/keymap";

import PanelHeader from "../elements/PanelHeader.vue";
import Pager from "@/components/elements/PanelPageBar.vue";

const audioService = AudioService.getInstance();

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export default defineComponent({
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    let {
      currentPattern,
      activePanel,
      beforePatternEditorLeave,
      beforePatternEditorEnter,
    } = storeToRefs(ui);
    return {
      main,
      ui,
      activePanel,
      beforePatternEditorLeave,
      beforePatternEditorEnter,
      currentPattern,
      audioService,
      Panels,
      debug
    };
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
    window.addEventListener("wheel", this.wheelScroll);
    window.addEventListener("blur", this.releaseKeys);

    if (this.activePanel == Panels.pattern) this.setCursor(true);
    if (this.ui.isFirstRun) {
      this.ui.activePanel = Panels.pad;
      this.ui.isFirstRun = false;
    } else {
      this.ui.activePanel = Panels.pattern;
    }
  },
  unmounted() {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
    window.removeEventListener("wheel", this.wheelScroll);
    window.removeEventListener("blur", this.releaseKeys);
  },
  data() {
    return {
      keyPressed: {} as {
        [key: string]: boolean;
      },
      activeCell: "00011",
      editMode: true,
      offset: 0,
      padding: 8,
      eventIdx: 0,
    };
  },
  methods: {
    formatIndex(index: number): string {
      return index < 10 ? "0" + index.toString() : index.toString();
    },
    formatNote(note: string | undefined): string {
      if (!note) return "---";
      return note.length == 3 ? note : `${note[0]}-${note[1]}`;
    },
    formatVelocity(velocity: number | undefined): string {
      if (!velocity) return "--";
      const hex = Math.floor(velocity * 255 * 0.79)
        .toString(16)
        .toUpperCase();
      return hex.length == 1 ? "0" + hex : hex;
    },
    formatId(row: number, column: number, subItem: number): string {
      return (
        this.formatIndex(row) + this.formatIndex(column) + subItem.toString()
      );
    },
    getRow() {
      return parseFloat(this.activeCell.slice(0, 2));
    },
    getColumn() {
      return parseFloat(this.activeCell.slice(2, 4));
    },
    isActiveRow(index: number) {
      return this.getRow() == index ? "p-row-active" : "";
    },
    moveActiveCell(dir: Direction, step: number) {
      if (dir == Direction.Down || dir == Direction.Up) {
        let value = dir == Direction.Down ? step : 0 - step;
        this.activeCell =
          this.formatIndex(this.getRow() + value) + this.activeCell.slice(2);
      } else {
        let value = dir == Direction.Right ? step : 0 - step;
        if (this.activeCell.slice(-1) == (value == 1 ? "2" : "1")) {
          if (
            (value == -1 && this.getColumn() == 1) ||
            (value == 1 && this.getColumn() == this.polyphonyLevel)
          )
            return;
          this.activeCell =
            this.activeCell.slice(0, 2) +
            this.formatIndex(this.getColumn() + value) +
            (value == 1 ? "1" : "2");
        } else
          this.activeCell =
            this.activeCell.slice(0, 4) +
            (parseFloat(this.activeCell.slice(-1)) + value).toString();
      }
    },
    moveActiveCellTo(row: number) {
      this.activeCell = this.formatIndex(row) + this.activeCell.slice(2);
    },
    setCursor(visible: boolean) {
      const cell = this.$refs[this.activeCell] as Array<HTMLElement>;
      if (visible) cell[0].classList.add("p-active");
      else cell[0].classList.remove("p-active");
    },
    moveCursor(direction: Direction, step: number = 1) {
      this.setCursor(false);
      this.moveActiveCell(direction, step);
      this.setCursor(true);
    },
    async scrollTo(row: number) {
      this.setCursor(false);
      this.offset = row;
      await nextTick();
      this.moveActiveCellTo(row);
      this.setCursor(true);
    },
    async scroll(direction: Direction, step: number = 1) {
      if (direction == Direction.Down) {
        if (this.offset + step <= this.patternLength - 1) {
          this.setCursor(false);
          this.offset += step;
          await nextTick();
          this.moveActiveCell(Direction.Down, step);
          this.setCursor(true);
        } else {
          console.log("Scrolling to last pos.");
          this.scrollTo(this.patternLength - 1);
        }
      }
      if (direction == Direction.Up) {
        if (this.offset - step >= 0) {
          this.setCursor(false);
          this.offset -= step;
          await nextTick();
          this.moveActiveCell(Direction.Up, step);
          this.setCursor(true);
        } else {
          this.scrollTo(0);
        }
      }
    },
    async editValue(note: string) {
      console.log(this.view, this.events[this.offset]);
      console.log(this.activeCell, this.offset);
      if (this.events[this.offset]) {
        if (this.activeCell.slice(4, 6) == "1")
          this.events[this.offset]!.notes[this.getColumn() - 1] = note;
        console.debug(
          "New value is set for a slot: ",
          this.events[this.offset]
        );
      } else {
        this.events[this.offset] = {
          notes: [note],
          velocities: [1],
          durations: [1],
        };
        console.debug(
          "New value is set for an empty slot: ",
          this.events[this.offset]
        );
      }
      // audioService.sequences[2].sequence.events[0] = new ToneSequenceEvent(
      //   ["C5"],
      //   [1],
      //   ["8n"]
      // );
      console.log(this.getRow());
      this.setCursor(false);
      await nextTick();
      this.scroll(Direction.Down, 1);
      this.setCursor(true);
    },
    async checkControllerKeys(key: string) {
      console.log(key);
      if (key == "ArrowDown" && this.getRow() < this.patternLength - 1)
        this.scroll(Direction.Down);
      if (key == "ArrowUp") this.scroll(Direction.Up);
      if (key == "ArrowRight") {
        if (!this.keyPressed["Control"]) this.moveCursor(Direction.Right);
        else if (this.currentPattern != this.lastPatternId)
          this.currentPattern += 1;
      }
      if (key == "ArrowLeft") {
        if (!this.keyPressed["Control"]) this.moveCursor(Direction.Left);
        else if (this.currentPattern != 0) this.currentPattern -= 1;
      }
      if (key == "PageUp") this.scroll(Direction.Up, 8);
      if (key == "PageDown") this.scroll(Direction.Down, 8);
      if (key == "Home") this.scrollTo(0);
      if (key == "End") this.scrollTo(this.patternLength - 1);
      if (key == "NumpadAdd") keymap.incrementOctave();
      if (key == "NumpadSubtract") keymap.decrementOctave();
      if (key == "Delete" && this.editMode) {
        await this.editValue("");
        return;
      }
    },
    keyDown(event: KeyboardEvent) {
      if (this.keyPressed[event.key] == true) return;
      const note = keymap.keys[event.code];
      if (note && !this.keyPressed["Control"]) {
        audioService.startNote(note, this.currentPattern);
        this.keyPressed[event.key] = true;
        if (this.editMode && this.ui.activePanel == Panels.pattern) {
          this.editValue(note);
        }
      } else {
        if (event.key == "Control") this.keyPressed[event.key] = true;
        if (this.ui.activePanel == Panels.pad) return;
        this.checkControllerKeys(event.code);
      }
    },
    keyUp(event: KeyboardEvent) {
      const note = keymap.keys[event.code];
      if (note && event.code != "NumpadSubtract")
        audioService.stopNote(note, this.currentPattern);
      this.keyPressed[event.key] = false;
    },
    releaseKeys() {
      console.debug("RELEASING...");
      Object.entries(this.keyPressed).forEach((entries) => {
        const note = keymap.keys[entries[0]];
        if (note) audioService.stopNote(note, this.currentPattern);
      });
      this.keyPressed = {};
    },
    wheelScroll(event: WheelEvent) {
      if (event.deltaY > 0) {
        this.scroll(Direction.Down);
      } else {
        this.scroll(Direction.Up);
      }
    },
  },
  computed: {
    formattedPatternId() {
      return this.currentPattern.toString().padStart(2, "0");
    },
    lastPatternId() {
      return Object.keys(audioService.sequences).length - 1;
    },
    events() {
      const events = this.audioService.sequences[this.currentPattern].sequence
        .events as ToneSequenceEvents;
      console.debug("CURRENT PATTERN EVENTS (view): ", events);
      return events;
    },
    view() {
      return [...Array(this.padding).fill(""), ...this.events].slice(
        this.offset
      );
    },
    patternLength() {
      return this.audioService.getSequenceLength(this.currentPattern);
    },
    polyphonyLevel() {
      return this.audioService.getPolyphony(this.currentPattern);
    },
  },
  watch: {
    beforePatternEditorEnter() {
      this.setCursor(true);
    },
    beforePatternEditorLeave() {
      this.setCursor(false);
    },
  },
  components: { PanelHeader, Pager },
});
</script>

<template>
  <PanelHeader title="Pattern" :id="Panels.pattern">
    <template #option>
      {{ formattedPatternId }}
    </template>
    <template #control>
      <Pager
      @next="currentPattern += 1"
      @previous="currentPattern -= 1"
      title="pattern"
        :value="currentPattern"
        :min="0"
        :max="lastPatternId"
        ></Pager>
      </template>
    </PanelHeader>
    <main>
      <div class="pattern">
        <div id="innerContent">
          <div :class="'p-rows ' + (editMode ? 'p-editable' : '')">
            <div
            class="p-row d-flex"
            :class="isActiveRow(eventIdx + offset - padding)"
            v-for="(event, eventIdx) in view"
            >
            <pre v-if="event != ''" :class="'p-index'"
            >{{ formatIndex(eventIdx + offset - padding) }} </pre
            >
            <p v-if="event == ''" class="p-row-placeholder"></p>
            <pre
            v-if="event == null"
            class="p-row-empty"
            v-for="x in polyphonyLevel"
            > <span :ref="formatId(eventIdx + offset - padding, x, 1)" class="p-note">---</span> <span :ref="formatId(eventIdx + offset - padding, x, 2)" class="p-velocity">--</span> </pre>
            <pre
            v-if="event"
            v-for="noteIdx in polyphonyLevel"
            > <span :id="formatId(eventIdx + offset - padding, noteIdx, 1)" :ref="formatId(eventIdx + offset - padding, noteIdx, 1)" :class="'p-note ' + ((events[eventIdx + offset - padding]?.notes[noteIdx - 1]) ? '' : 'p-empty')">{{ formatNote(events[eventIdx + offset - padding]?.notes[noteIdx - 1]) }}</span> <span :ref="formatId(eventIdx + offset - padding, noteIdx, 2)" class="p-velocity">{{ formatVelocity(events[eventIdx + offset - padding]?.velocities[noteIdx - 1]) }}</span> </pre>
          </div>
        </div>
      </div>
      <span style="margin-left: 380px; color:grey;" v-if="debug">{{ main.song.patterns[currentPattern] }}</span>
    </div>
  </main>
</template>

<style>
.pattern {
  background-color: black;
  height: 86.9vh;
  color: #fff;
  position: relative;
  margin-top: -0.8em;
  user-select: none;
  overflow: hidden;
}

#innerContent {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  font-size: 1.1em;
  text-align: left;
  font-weight: bolder;
}

.pattern pre {
  display: inline;
  margin: 0;
}

.p-index {
  color: white;
  background-color: #3a3a3a;
  background-image: linear-gradient(90deg, #000, #3a3a3a);
  padding-left: 45px;
  margin-left: 40px;
}

.p-row-placeholder {
  height: 7px;
}

.p-row-empty,
.p-empty {
  color: hsla(160, 100%, 37%, 1);
}

.p-row-active {
  background-color: #333;
  background-image: linear-gradient(90deg, #333, #000);
}

.p-velocity {
  color: grey;
}

.p-active {
  background-color: #508050;
}

.p-row .p-velocity.p-active,
.p-row-empty .p-active {
  color: white;
}

.p-editable {
  background-image: linear-gradient(180deg, #101310, #202320);
}

@media (min-width: 1024px) {
  .pattern {
    display: flex;
    place-items: center;
    place-content: center;
  }
}

@media (max-width: 768px) {
  .pattern {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 36vh;
  }
}
</style>
