<script lang="ts">
import { Toast } from "bootstrap";
import { defineComponent } from "vue";
import { useMainStore } from "@/stores/zss";

export default defineComponent({
  name: "BsToast",
  props: { message: String },
  setup() {
    const main = useMainStore();
    return {
      error: main.error,
      catchError: main.catchError,
    };
  },
  mounted() {
    var toast = new Toast(this.$refs.el as string | Element);
    toast.show();
  },
});
</script>
<template>
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div
      ref="el"
      class="toast align-items-center text-white bg-dark border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ catchError().message }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>
