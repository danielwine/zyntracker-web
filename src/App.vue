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

.container-app {
  -ms-flex: 0 0 230px;
  flex: 0 0 1024px;
  /* min-height: 682px; */
  height: 652px;
}

.container-panel {
  height: 550px;
}

.container-main {
  background-color: white;
  color: black;
  /* height: 580px; */
  height: 550px;
  overflow: hidden;
  /* padding: 36px; */
}
.container-nav {
  margin-top: 20px;
}

@media screen and (max-width: 992px) {
  .container-nav-row {
    position: fixed !important;
    bottom: 0;
    width: 100%;
  }
}
.container-main-narrow {
  box-shadow: 2px 2px 8px black;
  height: 280px;
}

.container-main-splash,
.container-panel-splash {
  background-color: #333;
  height: 550px;
  /* background-image: url("./assets/logo.svg");
  background-repeat: no-repeat;
  background-size: 25%;
  background-position: center; */
}

.container-main- .nav-buttons {
  background-color: black;
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
  /* background-color: black; */
  /* background-color: rgba(150, 150, 150, 0.5); */
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
  /* background-color: rgba(88,88, 88, 0.5); */
  color: white;
  transition: 0.15s ease-in-out;
}

@media (max-width: 690px) {
  .sidebar {
    display: none;
  }
}

/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
