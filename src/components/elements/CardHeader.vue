<script setup lang="ts">
const props = defineProps({
  title: String,
  subtitle: String,
});
</script>

<template>
  <h2 class="fw-bold mb-2 text-uppercase">{{ title }}</h2>
  <span class="subtitle ms-0">{{ subtitle }}</span>
</template>

<style>
.subtitle {
  color: lightgreen;
}
</style>
