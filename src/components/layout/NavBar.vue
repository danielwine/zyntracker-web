<script lang="ts">
import { defineComponent } from "vue";
import { useUIStore } from "@/stores/ui";
import { useMainStore } from "@/stores/zss";
import { Action, Alert } from "@/stores/model";
import alerts from "@/composables/alert";
import { storeToRefs } from "pinia";

export default defineComponent({
  emits: ["resetRequest"],
  setup() {
    const { alert, alertReturned } = storeToRefs(useUIStore());
    return {
      main: useMainStore(),
      alerts,
      alert,
      alertReturned,
    };
  },
  methods: {
    handleClick() {
      if (this.main.loaded) this.alert = alerts["notsaved"];
    },
  },
  watch: {
    alertReturned() {
      if (this.alertReturned != "") {
        const value = this.alertReturned;
        this.alertReturned = "";
        if (this.alert.buttons[value] == Action.restart) {
          this.alert = new Alert();
          this.$emit("resetRequest");
        }
      }
    },
  },
});
</script>

<template>
  <nav class="navbar navbar-exp navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" @click="handleClick">
        <slot name="brand"></slot>
      </a>
      &nbsp;
      <slot name="rawcontent"></slot>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a
              class="nav-link disabled"
              href="#"
              tabindex="-1"
              aria-disabled="true"
              >Disabled</a
            >
          </li>
        </ul>
        <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>
<style>
.bg-dark {
  background-color: #333 !important;
}
a.navbar-brand {
  cursor: pointer;
}
</style>
