import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap/dist/js/bootstrap.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faStop,
  faDownload,
  faUpload,
  faSave,
  faQuestion,
  faCaretLeft,
  faCaretRight,
  faMusic,
  faTh,
  faAlignJustify,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faPlay,
  faStop,
  faDownload,
  faUpload,
  faSave,
  faQuestion,
  faCaretLeft,
  faCaretRight,
  faMusic,
  faTh,
  faAlignJustify
);

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app
  .use(createPinia())
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
