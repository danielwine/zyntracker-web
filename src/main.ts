import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap/dist/js/bootstrap.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faArrowLeft,
  faPlay,
  faPlayCircle,
  faStop,
  faDownload,
  faUpload,
  faSave,
  faInfo,
  faQuestion,
  faCaretLeft,
  faCaretRight,
  faMusic,
  faTh,
  faAlignJustify,
  faWrench,
  faPlus,
  faMinus,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faBars,
  faArrowLeft,
  faPlay,
  faPlayCircle,
  faStop,
  faDownload,
  faUpload,
  faSave,
  faInfo,
  faQuestion,
  faCaretLeft,
  faCaretRight,
  faMusic,
  faTh,
  faAlignJustify,
  faWrench,
  faPlus,
  faMinus,
  faExclamationTriangle
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
