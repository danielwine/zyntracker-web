import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/MainLayout.vue"),
      children: [
        {
          path: "",
          name: "pattern",
          props: true,
          component: () => {
            // console.log(useMainStore().song.name);

            // if (useMainStore().song.name)
            return import("@/views/PatternView.vue");
            // return import("@/views/ImportView.vue");
          },
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
      ],
    },
  ],
});

export default router;
