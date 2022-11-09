<script setup lang="ts">
const props = defineProps({
  title: String,
  active: { type: Boolean, default: false },
});
</script>

<template>
  <div
    class="block-label"
    :class="active ? 'block-label-active' : 'block-label-inactive'"
  >
    {{ title }}
    <span>
      <slot name="option"></slot>
    </span>
  </div>
</template>

<style>
.block-label {
  padding: 0.75em 1.8em 0.75em 1.8em;
  margin-bottom: 0.8em;
}

.block-label-active {
  color: black;
  background-color: white;
}

.block-label-inactive {
  color: white;
  background-color: #555;
}
</style>
