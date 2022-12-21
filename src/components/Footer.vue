<script lang="ts">
import { useUIStore } from "@/stores/ui";
import type { ISwitch } from "@/stores/ui";
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import TransportBar from "./TransportBar.vue";
import { version, author } from "@/library/res/Config";

export default defineComponent({
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return {
      main,
      ui,
      version,
      author,
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
    <span class="app-info">
      <span class="app-name"> ZynTracker {{ version }} </span>&nbsp;&nbsp;<span
        class="app-author"
        >by {{ author }}</span
      >
    </span>
  </div>
</template>

<style scoped>
.footer {
  /* position: fixed; */
  /* bottom: 0; */
  /* padding-left: 0.8rem; */
  /* height: 3.2em; */
  margin-top: 1em;
  width: 100%;
  height: 3em;
}

.switch-active {
  background-color: red;
}

.switch-disabled {
  color: grey;
}

.app-info {
  float: left;
  margin-top: 10px;
  margin-right: 12px;
  margin-left: 12px;
}
.app-info .app-name {
  color: #bbb;
}
.app-info .app-author {
  color: #666;
}
</style>
