<script lang="ts">
export default {
  props: {
    names: {
      type: Array<String>,
    },
  },
};
</script>

<template>
  <ul>
    <li
      v-for="name in names"
      @click="$emit('fileselected', name)"
      class="file-item"
    >
      {{ name }}
    </li>
  </ul>
</template>

<style scoped>
ul {
  padding-left: 0;
}

.file-item {
  list-style: none;
  padding: 0.2em 0.5em 0.2em 0.5em;
}
.file-item:hover {
  background-color: #333;
}
</style>
