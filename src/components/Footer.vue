<script lang="ts">
import { useUIStore } from "@/stores/ui";
import type { ISwitch } from "@/stores/ui";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const ui = useUIStore();
    return {
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
    // getSwitchActiveClass(item: ISwitch) {
    //   return item.state ? "switch-active" : "";
    // },
    // getSwitchDisabledClass(item: ISwitch) {
    //   return item.disabled ? "switch-disabled" : "";
    // },
  },
});
</script>

<template>
  <div class="footer bg-dark p-2">
    <div class="help">
      <span
        class="help-link"
        v-if="$route.name"
        v-for="item of Object.entries(ui.switches)"
      >
        <RouterLink
          :class="`${getSwitchClass(item[1], 'active')} ${getSwitchClass(
            item[1],
            'disabled'
          )}`"
          :to="'/' + item[1].name"
          >{{ item[0] + " " + item[1].name.toUpperCase() }}</RouterLink
        >&nbsp;
      </span>
      <span v-if="$route.name" class="help-text">
        {{ help[$route.name.toString()].text }}
      </span>
      <p></p>
    </div>
  </div>
</template>
<style>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  /* height: 2em; */
}

.switch-active {
  background-color: red;
}

.switch-disabled {
  color: grey;
}
</style>
