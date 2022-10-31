import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
        {
          path: "",
          name: "pad",
          component: () => import("@/views/ZynpadView.vue"),
        },
        {
          path: "about",
          name: "about",
          component: () => import("@/views/AboutView.vue"),
        },
        {
          path: "options",
          name: "options",
          component: () => import("@/views/OptionsView.vue"),
        },
        {
          path: "edit/:audioSeqID",
          name: "edit",
          props: true,
          component: () => import("@/views/PatternView.vue"),
        },
      ],
    },
  ],
});

export default router;
