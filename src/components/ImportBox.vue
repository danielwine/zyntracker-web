<script lang="ts">
import { defineComponent } from "vue";
import IconBarButton from "./shared/IconBarButton.vue";

export default defineComponent({
  emits: ["browse", "upload", "import"],
  components: { IconBarButton },
  methods: {
    openFile() {
      return;
    },
  },
});
</script>

<template>
  <div class="import-box">
    <button class="btn btn-secondary" @click="$emit('browse')">
      Browse test songs
    </button>
    <IconBarButton
      @fileSelected="openFile"
      iconName="upload"
      caption="Upload snapshot file"
      :fileinput="true"
    />
    <IconBarButton
      @fileSelected="openFile"
      iconName="upload"
      caption="Import phrases from XRNS"
      :fileinput="true"
    />
  </div>
</template>

<style scoped></style>
