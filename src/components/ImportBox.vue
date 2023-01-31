<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["browse", "upload", "import"],
});
</script>

<template>
  <div class="import-box">
    <button class="btn btn-secondary" @click="$emit('browse')">
      Browse test songs
    </button>
    <button class="btn btn-secondary" @click="$emit('upload')" disabled>
      Upload snapshot file
    </button>
    <button class="btn btn-secondary" @click="$emit('import')" disabled>
      Import phrases from XRNS
    </button>
  </div>
</template>

<style scoped></style>
