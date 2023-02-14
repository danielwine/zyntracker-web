<script lang="ts">
import useUpload from "@/composables/upload";
import { defineComponent } from "vue";
import { defaultSnapshot } from "@/library/core/res/resource";
import Button from "../elements/Button.vue";

export default defineComponent({
  emits: ["browse", "upload", "import"],
  components: { Button },
  setup() {
    const { openFile, load } = useUpload();
    return { openFile, load, defaultSnapshot };
  },
});
</script>

<template>
  <div class="col-xl-4">
    <Button
      @clicked="load(defaultSnapshot)"
      caption="Browse songs"
      hint="Browse / test factory ZSS files"
      highlighted
      wide
    />
  </div>
  <div class="col-xl-4">
    <Button
      @fileSelected="openFile"
      iconName="upload"
      caption="Import file"
      hint="Open / import ZSS or XRNS file"
      type="fileinput"
      wide
    />
  </div>
</template>

<style scoped></style>
