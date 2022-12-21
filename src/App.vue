<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
.bg-darkgray {
  background: #333 !important;
}

@keyframes fadein {
  to {
    opacity: 1;
    visibility: visible;
  }
}

.nav-button {
  background-color: white;
  color: black;
  padding-top: 16px;
  height: 82px;
  text-transform: uppercase;
  font-family: monospace;
  /* font-family: "Major Mono Display", monospace; */
  font-size: 2em;
  font-weight: bold;
  box-shadow: 1px 1px 20px #222;
}

a.router-link-active {
  color: white;
  transition: 0.15s ease-in-out;
}

/* a, */
a.nav-button,
a.router-link-exact-active {
  text-decoration: none;
}

a.nav-button:hover {
  background-color: rgba(98, 98, 98, 0.5);
  color: white;
  transition: 0.15s ease-in-out;
}

@media (max-width: 690px) {
  .sidebar {
    display: none;
  }
}
</style>
