<script lang="ts">
import { defineComponent } from "vue";
import type { RouteRecordName } from "vue-router";

export default defineComponent({
  mounted() {
    let route: RouteRecordName | undefined | null;
    route = this.$router.currentRoute.value.name;
  },
  props: {
    background: { type: String, required: false, default: "" },
    sideBackground: { type: String, required: false, default: "success" },
    gutters: { type: Boolean, required: false, default: true },
    header: { type: Boolean, required: false, default: true },
    padding: { type: Boolean, required: false, default: true },
  },
});
</script>

<template>
  <div
    id="main"
    :class="'col-md-8 container-main p-0 ' + (gutters ? 'g-0' : 'g-0') + ' '"
  >
    <div :class="padding ? 'p' : 'p-0'">
      <slot name="main"></slot>
    </div>
  </div>
  <div
    id="side"
    class="col-md-4 container-side ps-3 pe-3"
    :class="'bg-' + sideBackground"
  >
    <slot name="side"> </slot>
  </div>
</template>

<style>
.p {
  padding: 1rem 2.4rem 2rem 2.4rem;
}

.container-main h1 {
  background-color: beige;
  padding: 0.3em;
  font-size: 2.1em;
  margin-top: 0;
  margin-bottom: 0.5em;
}

.container-side {
  background: var(--bgImage);
  /* background-position: 80px; */
  background-size: cover;
  /* padding-top: 0.9em; */
}

@media screen and (max-width: 992px) {
  .container-side {
    position: fixed;
    height: 90%;
    z-index: 0;
    top: 0;
  }
}
</style>
