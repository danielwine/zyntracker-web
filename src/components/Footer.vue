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
