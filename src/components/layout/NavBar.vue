<script lang="ts">
import MenuSideBar from "../elements/MenuSideBar.vue";

export default {
  emits: ["brandClicked"],
  props: {
    togglerVisible: { type: Boolean, default: true },
    togglerActive: { type: Boolean, default: true },
    pagesVisible: { type: Boolean, default: true },
  },
  data() {
    return { toggleState: true };
  },
  methods: {
    toggle() {
      this.toggleState = !this.toggleState;
    },
    isActive(name: string) {
      return this.$route.name == name ? "nav-item-active" : "sads";
    },
  },
  components: { MenuSideBar },
};
</script>

<template>
  <MenuSideBar :toggle="toggleState" @toggleRequest="toggle"></MenuSideBar>
  <div id="content">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <div class="d-flex align-items-center">
          <button
            v-if="togglerVisible"
            type="button"
            id="sidebarCollapse"
            class="btn btn-info"
            @click="togglerActive ? toggle() : {}"
            :disabled="!togglerActive"
          >
            <font-awesome-icon
              class=""
              :icon="['fas', 'bars']"
              title="Hide Menu"
            />
          </button>
          <a class="navbar-brand ms-3 me-2" @click="$emit('brandClicked')">
            <slot name="brand"></slot>
          </a>
        </div>
        <!-- <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          >
          <span class="navbar-toggler-icon"></span>
        </button> -->

        <div
          v-if="pagesVisible"
          class="collapse navbar-collapse ms-3"
          id="navbarSupportedContent"
        >
          <ul class="nav navbar-nav ml-auto">
            <li class="nav-item active me-3">
              <RouterLink
                class="nav-item-page"
                :class="isActive('pattern')"
                to="/"
                >Pattern</RouterLink
              >
            </li>
            <li class="nav-item active me-3">
              <RouterLink
                class="nav-item-page"
                :class="isActive('options')"
                to="/options"
                >Options</RouterLink
              >
            </li>
            <li class="nav-item active me-3">
              <RouterLink
                class="nav-item-page"
                :class="isActive('about')"
                to="/about"
                >About</RouterLink
              >
            </li>
          </ul>
        </div>
        <slot name="content"></slot>
      </div>
    </nav>
  </div>
  <div
    class="overlay"
    v-bind:class="toggleState ? '' : 'active'"
    @click="toggle"
  ></div>
</template>

<style>
p {
  font-size: 1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}

.navbar {
  background: #fff;
  border: none;
  border-radius: 0;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  cursor: pointer;
}

a.router-link-active.nav-item-page {
  color: grey;
}

.nav-item-active {
  color: white !important;
}

.nav-item-page {
  color: grey;
}

.bg-dark {
  background-color: #333 !important;
}

#content {
  width: 100%;
  transition: all 0.3s;
  top: 0;
  right: 0;
}
.overlay.active {
  display: block;
  opacity: 1;
}
.overlay {
  display: none;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 998;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}
</style>