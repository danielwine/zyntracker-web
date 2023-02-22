<script setup lang="ts">
const props = defineProps({
  toggle: Boolean,
});
const emit = defineEmits(["logout"]);
</script>

<template>
  <nav id="sidebar" v-bind:class="toggle ? 'show' : 'hide'">
    <ul class="list-unstyled components">
      <li class="active">
        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false"
          >Home</a
        >
        <ul class="collapse list-unstyled" id="homeSubmenu">
          <li>
            <a>Home 1</a>
          </li>
          <li>
            <a>Home 2</a>
          </li>
          <li>
            <a>Home 3</a>
          </li>
        </ul>
      </li>
      <li>
        <a>Pattern</a>
        <a data-toggle="collapse" aria-expanded="false">Snapshots</a>
        <ul class="list-unstyled" id="pageSubmenu">
          <li>
            <a>Testpage 1</a>
          </li>
          <li>
            <a>Testpage 2</a>
          </li>
          <li>
            <a>Testpage 3</a>
          </li>
        </ul>
      </li>
      <li>
        <a>Options</a>
      </li>
      <li>
        <a>About</a>
      </li>
    </ul>
    <ul class="list-unstyled">
      <li>
        <a @click="emit('logout')">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
#sidebar {
  width: 250px;
  position: fixed;
  top: 58px;
  left: -250px;
  height: 100vh;
  z-index: 999;
  background: #424242;
  color: #fff;
  transition: all 0.3s;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
}

#sidebar.active {
  left: 0;
}

#dismiss {
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: #777;
  color: white;
  z-index: 999;

  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}

#dismiss:hover {
  background: #fff;
  color: #555;
}
#sidebar .sidebar-header {
  padding: 20px;
  background: #777;
}

#sidebar ul.components {
  padding: 20px 0;
  border-bottom: 1px solid #777;
}

#sidebar ul p {
  color: #fff;
  padding: 10px;
}

#sidebar ul li a {
  padding: 10px;
  font-size: 1em;
  display: block;
  /* color: #fff; */
  color: #aaa;
  text-decoration: none;
}

#sidebar ul li a:hover {
  color: #777;
  background: #fff;
}

#sidebar ul li.active > a,
a[aria-expanded="true"] {
  color: #fff;
  background: #777;
}

a[data-toggle="collapse"] {
  position: relative;
}

.dropdown-toggle::after {
  display: block;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: #555;
}

@media (min-width: 768px) {
  #sidebar {
    margin-left: 0;
  }

  #content {
    min-width: 0;
    width: 100%;
  }
  .show {
    margin-left: 0 !important;
  }
  .hide {
    margin-left: 250px !important;
  }
}
@media (max-width: 767px) {
  .show {
    margin-left: 0 !important;
  }
  .hide {
    margin-left: 250px !important;
  }
}
</style>
