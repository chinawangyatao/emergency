import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "Home",
      component: () =>
        import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      meta: {
        index: 1,
      },
    },
    {
      path: "/detail",
      name: "Detail",
      component: () =>
        import(/* webpackChunkName: "home" */ "@/views/Detail.vue"),
      meta: {
        index: 2,
      },
    },
    {
      path: "/vedio",
      name: "Vedio",
      component: () =>
        import(/* webpackChunkName: "home" */ "@/views/Vedio.vue"),
      meta: {
        index: 3,
      },
    },
    {
      path: "/vedioList",
      name: "VedioList",
      component: () =>
        import(/* webpackChunkName: "home" */ "@/views/VedioList.vue"),
      meta: {
        index: 3,
      },
    },
  ],
});

export default router;
