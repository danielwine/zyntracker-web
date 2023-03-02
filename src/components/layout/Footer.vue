<script lang="ts">
import { useUIStore } from "@/stores/ui";
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";
import TransportBar from "../app/TransportBar.vue";
import { appInfo } from "@/composables/config";

export default defineComponent({
  setup() {
    const main = useMainStore();
    const ui = useUIStore();
    return {
      main,
      ui,
      appNameShort: appInfo.nameShort,
      version: appInfo.version,
      author: appInfo.author,
    };
  },
  components: { TransportBar },
});
</script>

<template>
  <div class="footer bg-dark">
    <span class="app-info">
      <span class="app-name"> {{ appNameShort }} {{ version }} </span
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
