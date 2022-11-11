<script lang="ts">
import { useUIStore } from "@/stores/ui";
import type { ISwitch } from "@/stores/ui";
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import TransportBar from "./TransportBar.vue";

export default defineComponent({
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return {
      main,
      ui,
    };
  },
  methods: {
    getSwitchClass(item: ISwitch, attribute: string) {
      console.log(attribute, item);
      if (attribute in item)
        return item[attribute] ? `switch-${attribute}` : "";
    },
  },
  components: { TransportBar },
});
</script>

<template>
  <div class="footer bg-dark">
    <TransportBar></TransportBar>
    <!-- <div class="help"> -->
    <!-- v-if="$route.name" -->

    <!-- <span class="help-link" v-for="item of Object.entries(ui.switches)">
      <RouterLink
        :class="`${getSwitchClass(item[1], 'active')} ${getSwitchClass(
          item[1],
          'disabled'
        )}`"
        :to="'/' + item[1].name"
        >{{ item[0] + " " + item[1].name.toUpperCase() }}</RouterLink
      >&nbsp;
    </span> -->

    <!-- <span v-if="$route.name" class="help-text">
        {{ help[$route.name.toString()].text }}
      </span> -->
    <!-- <span class="flex-grow-2">0.0.1</span> -->
    <p></p>
  </div>
  <!-- </div> -->
</template>
<style>
.footer {
  position: fixed;
  bottom: 0;
  padding-left: 0.8rem;
  /* padding: 0.25rem 1.8em 0.25rem 1.8em; */
  /* padding: 0.5rem; */
  /* height: 3.2em; */
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
