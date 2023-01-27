<script lang="ts">
import { defineComponent } from "vue";
import { AudioService } from "@/library/core/audioservice";
import IconBarButton from "./IconBarButton.vue";

const audioService = AudioService.getInstance();

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
  components: { IconBarButton },
});
</script>

<template>
  <span class="pager">
    <IconBarButton
      @buttonClicked="$emit('previous')"
      :hint="
        customHintBack ? customHintBack : 'Previous ' + title + ' (Ctrl-Left)'
      "
      iconName="minus"
      :disabled="value == min"
      :transparent="true"
    ></IconBarButton>
    <IconBarButton
      @buttonClicked="$emit('next')"
      :hint="
        customHintForward
          ? customHintForward
          : 'Next ' + title + ' (Ctrl-Right)'
      "
      iconName="plus"
      :disabled="value == max"
      :transparent="true"
    ></IconBarButton>
    <!-- <code class="caption"> </code> -->
  </span>
</template>

<style scoped>
.pager {
  padding: 0;
  margin: 0;
}
</style>
