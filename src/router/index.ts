import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/components/layout/MainLayout.vue"),
      children: [
        {
          path: "",
          name: "pattern",
          props: true,
          component: () => import("@/components/pages/PatternView.vue"),
          meta: {
            type: 'page'
          }
        },
        {
          path: "about",
          name: "about",
          component: () => import("@/components/pages/AboutView.vue"),
        },
        {
          path: "options",
          name: "options",
          component: () => import("@/components/pages/OptionsView.vue"),
        },
      ],
    },
  ],
});

export default router;
