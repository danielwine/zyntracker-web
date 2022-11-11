<template>
  <div class="icon-bar">
    <slot name="icons"></slot>
    <!-- <span class="me-4"></span> -->
  </div>
</template>

<style scoped>
.icon-bar {
  background-color: #333;
  margin: 0.6em 0 0em;
}
.icon-bar button {
  margin: 0px 12px 0px 0;
  /* margin: 2% 2.85% 2% 0%; */
}
</style>
