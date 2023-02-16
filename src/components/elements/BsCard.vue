<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Card",
});
</script>

<template>
  <div class="col-12 col-md-8 col-lg-8 col-xl-6">
    <div class="card bg-dark">
      <div class="card-body p-sm-5">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
<style>
.card {
  border-radius: 0;
}
.card-body {
  padding: 2.5em;
}
</style>
