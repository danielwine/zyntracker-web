<script lang="ts">
import { useUIStore } from "@/stores/ui";
import type { ISwitch } from "@/stores/ui";
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";

export default defineComponent({
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return {
      main,
      ui,
    };
  },
  data() {
    return {
      help: {
        pad: {
          keys: [
            ["about", "F1 ABOUT"],
            ["edit", "F2 EDIT"],
          ],
          text:
            "CLICK on a pad -> seq start/stop \n" +
            "LONG-CLICK / CTRL-ENTER -> edit.",
        },
        edit: {
          keys: [
            ["about", "F1 ABOUT"],
            ["", "F2 PADS"],
          ],
          text:
            "↑ ↓ ← →  ESC: edit  +/-\n: change octave" + "A-Z: play a note.",
        },
        about: {
          keys: [
            ["about", "F1 ABOUT"],
            ["edit", "F2 EDIT"],
          ],
          text: "",
        },
      } as { [key: string]: { keys: string[][]; text: string } },
    };
  },
  methods: {
    getSwitchClass(item: ISwitch, attribute: string) {
      console.log(attribute, item);

      if (attribute in item)
        return item[attribute] ? `switch-${attribute}` : "";
    },
  },
});
</script>

<template>
  <div class="footer bg-dark">
    <!-- <div class="help"> -->
    <!-- v-if="$route.name" -->
    <span class="help-link" v-for="item of Object.entries(ui.switches)">
      <RouterLink
        :class="`${getSwitchClass(item[1], 'active')} ${getSwitchClass(
          item[1],
          'disabled'
        )}`"
        :to="'/' + item[1].name"
        >{{ item[0] + " " + item[1].name.toUpperCase() }}</RouterLink
      >&nbsp;
    </span>
    <!-- <span v-if="$route.name" class="help-text">
        {{ help[$route.name.toString()].text }}
      </span> -->
    <p></p>
  </div>
  <!-- </div> -->
</template>
<style>
.footer {
  position: fixed;
  bottom: 0;
  padding: 0.75em 1.8em 0.75em 1.8em;
  height: 3.2em;
  margin: 0;
  width: 100%;
  /* height: 2em; */
}

.switch-active {
  background-color: red;
}

.switch-disabled {
  color: grey;
}

.help {
  /* padding: 0.75em 1.8em 0.75em 1.8em; */
  margin: 0;
  /* padding-top: 0.85em; */
  /* padding-bottom: 0.6em; */
}

.help-link {
  text-align: left;
}
.help-text {
  height: 40px;
}
</style>
