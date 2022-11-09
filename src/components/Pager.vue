<script lang="ts">
import { defineComponent } from "vue";
import { AudioService } from "@/library/AudioService";

const audioService = AudioService.getInstance();

export default defineComponent({
  emits: ["next", "previous"],
  props: {
    bankId: Number,
  },
  methods: {
    formatIndex(index: number): string {
      return index < 10 ? "0" + index.toString() : index.toString();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
});
</script>

<template>
  <span>
    <span class="pe-3"
      ><i
        class="header-nav-item fa fa-chevron-left fa-2x"
        v-on:click="goBack()"
      ></i
    ></span>
    <button
      class="btn btn-dark"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Previous bank"
      disabled
    >
      <i class="fa fa-caret-left"></i>
    </button>
    <button
      class="btn btn-dark ms-1"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Next bank"
      disabled
    >
      <i class="fa fa-caret-right"></i>
    </button>
    <code class="caption">
      &nbsp; bank {{ String(bankId).padStart(2, "0") }}
    </code>
  </span>
</template>

<style scoped>
#statusbar {
  height: 3.8em;
  user-select: none;
  color: #fff;
  background-color: #333;
}

#statusbar button i {
  margin-top: 3px;
  padding: 0.1em 0.1em 0.3em 0.2em;
}

#innerContent {
  font-size: 1em;
  text-align: left;
  background: #333;
}

#innerContent small {
  top: -2px;
}

#innerContent .caption {
  margin-top: 16px !important;
  margin-left: -10px;
}

#innerContent .caption,
.song-info {
  font-size: 0.92em;
  color: burlywood;
  /* color: #66e969; */
  margin-top: 4px;
}

#innerContent button {
  margin-top: -10px;
}
.song-info {
  padding-top: 0.9em;
}

@media screen and (max-width: 576px) {
  .song-info-detail {
    display: none;
  }
}

.header-nav-item {
  cursor: pointer;
  padding: 5px 10px 5px 5px;
  background-color: transparent;
  transition: 0.15s ease-in-out;
}

.header-nav-item:hover {
  background-color: #666;
  color: white;
  transition: 0.15s ease-in-out;
}

button:disabled {
  color: grey;
}
</style>
