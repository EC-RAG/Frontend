import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../layout/rootlayout.vue"),
      children:[
        {
          path: "/datalist",
          name: "datalist",
          component: () => import("../views/datalist.vue"),
        },
        {
          path: "/alias",
          name: "alias",
          component: () => import("../views/alias.vue"),
        },
        {
          path: "/chat",
          name: "chat",
          component: () => import("../views/chat.vue"),
        },
        {
          path: "/rule",
          name: "rule",
          component: () => import("../views/rule.vue"),
        }
      ]
    },

  ]
})

export default router