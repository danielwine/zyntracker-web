<script lang="ts">
import { defineComponent } from "vue";
import Button from "./Button.vue";

export default defineComponent({
  emits: ["next", "previous"],
  props: {
    title: String,
    value: Number,
    customHintBack: String,
    customHintForward: String,
    min: Number,
    max: Number,
  },
  methods: {
    formatIndex(index: number): string {
      return index < 10 ? "0" + index.toString() : index.toString();
    },
  },
  components: { Button },
});
</script>

<template>
  <span class="pager">
    <Button
      @clicked="$emit('previous')"
      :hint="
        customHintBack ? customHintBack : 'Previous ' + title + ' (Ctrl-Left)'
      "
      iconName="minus"
      :disabled="value == min"
      transparent
    ></Button>
    <Button
      @clicked="$emit('next')"
      :hint="
        customHintForward
          ? customHintForward
          : 'Next ' + title + ' (Ctrl-Right)'
      "
      iconName="plus"
      :disabled="value == max"
      transparent
    ></Button>
  </span>
</template>

<style scoped>
.pager {
  padding: 0;
  margin: 0;
}
</style>
