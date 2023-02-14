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
  margin-top: 10px;
  padding-left: 10px;
}

.file-item {
  list-style: none;
  cursor: pointer;
  padding: 0.15em 0.5em 0.15em 0.5em;
}
.file-item:hover {
  background-color: #333;
}
</style>
