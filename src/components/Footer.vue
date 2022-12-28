<script lang="ts">
import { useUIStore } from "@/stores/ui";
import type { ISwitch } from "@/stores/ui";
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import TransportBar from "./TransportBar.vue";
import { version, author, appName } from "@/library/res/Config";

export default defineComponent({
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return {
      main,
      ui,
      appName,
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
      <span class="app-name"> {{ appName.split(" ")[0] }} {{ version }} </span
      >&nbsp;&nbsp;<span class="app-author">by {{ author }}</span>
    </span>
  </div>
</template>

<style scoped>
.footer {
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
  margin-left: 17px;
}
.app-info .app-name {
  color: #bbb;
}
.app-info .app-author {
  color: #666;
}
</style>
