<script lang="ts">
import { Alert, AlertType } from "@/stores/model";
import { useUIStore } from "@/stores/ui";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Alert",
  setup() {
    const ui = useUIStore();
    return { ui, Alert, AlertType };
  },
  computed: {
    icon() {
      if (this.ui.alert.type == AlertType.confirmation)
        return "exclamation-triangle";
      if (this.ui.alert.type == AlertType.info) return "info";
    },
  },
});
</script>

<template>
  <div class="modal" tabindex="-1" id="alert" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <font-awesome-icon class="text-warning" :icon="['fas', icon]" />&nbsp;
            {{ AlertType[ui.alert.type] }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            @click="ui.alert = new Alert()"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="modal-message">{{ ui.alert.message }}</div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="ui.alertReturned = 'ok'"
          >
            Ok
          </button>
          <button
            type="button"
            disabled
            class="btn btn-secondary"
            @click="ui.alertReturned = 'save'"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  background-color: rgba(30, 30, 30, 0.6);
}
.modal-content {
  margin-top: 50%;
  border-radius: 0;
  background-color: #444;
}
.btn-close-white {
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23f8a'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
}
</style>
