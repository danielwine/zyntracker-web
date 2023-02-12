<script setup lang="ts">
import logo from "@/assets/images/eq.png";
</script>
<template>
  <img :src="logo" class="logo ms-5" />
</template>
<style>
.logo {
  margin-top: 1em;
  margin-bottom: 1em;
  animation-name: grow;
  animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  animation-duration: 0.6s;
  width: 70%;
}

@keyframes grow {
  from {
    opacity: 0;
    transform: scale3d(1, 0.3, 1);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
</style>
