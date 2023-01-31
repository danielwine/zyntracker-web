<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["buttonClicked", "fileSelected"],
  props: {
    iconName: String,
    hint: String,
    disabled: { type: Boolean, default: false },
    transparent: { type: Boolean, default: false },
    fileinput: { type: Boolean, default: false },
    customClass: String,
  },
  methods: {
    handleFileInputChange($event: Event) {
      const target = $event.target as HTMLInputElement;
      this.$emit("fileSelected", target.files ? target.files[0] : undefined);
    },
    browse() {
      document.getElementById("FileInput")?.click();
    },
    onClick() {
      if (this.fileinput) this.browse();
      this.$emit("buttonClicked");
    },
  },
});
</script>

<template>
  <input
    v-if="fileinput"
    type="file"
    style="display: none"
    id="FileInput"
    @change="handleFileInputChange"
  />

  <button
    class="ms-2 btn"
    :class="(!transparent ? 'btn-dark' : 'btn-transparent') + ' ' + customClass"
    v-on:click="onClick()"
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    :title="hint"
    :disabled="disabled"
  >
    <font-awesome-icon class="btn-green" :icon="['fas', iconName]" />
  </button>
</template>

<style scoped>
button {
  width: 42px;
}
.btn-green {
  color: #66e969;
}
.btn-transparent {
  background-color: transparent;
  border-color: transparent;
}
</style>
