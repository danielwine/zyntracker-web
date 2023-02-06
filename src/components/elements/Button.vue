<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["clicked", "fileSelected"],
  props: {
    iconName: { type: String, default: "" },
    hint: String,
    caption: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    transparent: { type: Boolean, default: false },
    highlighted: { type: Boolean, default: false },
    wide: { type: Boolean, default: false },
    type: { type: String, default: "" },
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
      if (this.type == "fileinput") this.browse();
      this.$emit("clicked");
    },
  },
});
</script>

<template>
  <input
    v-if="type == 'fileinput'"
    type="file"
    style="display: none"
    id="FileInput"
    @change="handleFileInputChange"
  />

  <button
    class="btn"
    :type="type == 'submit' ? type : 'button'"
    :class="
      (caption ? '' : 'button-simple') +
      ' ' +
      (transparent ? 'btn-transparent' : '') +
      ' ' +
      (wide ? 'w-100' : 'ms-2') +
      ' ' +
      (highlighted ? 'btn-success' : '') +
      ' ' +
      (!highlighted && !transparent ? 'btn-dark' : '') +
      ' ' +
      (customClass ? customClass : '')
    "
    v-on:click="onClick()"
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    :title="hint"
    :disabled="disabled"
  >
    <font-awesome-icon
      v-if="iconName"
      class="btn-green"
      :icon="['fas', iconName]"
    />
    <span v-if="caption"> &nbsp;{{ caption }} </span>
  </button>
</template>
