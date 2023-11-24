import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Helloworld from "@/components/HelloWorld.vue";
import PaintWidgetDemo from "@/components/PaintWidgetDemo.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: () => {
      return { path: "/home" };
    }
  },
  {
    path: "/home",
    name: "Helloworld",
    component: Helloworld
  },
  {
    path: "/paint",
    name: "PaintWidget",
    component: PaintWidgetDemo
  },
  {
    path: "/:currentPath(.*)*",
    redirect: () => {
      return { path: "/404" };
    }
  }
];

const router = createRouter({
  history: createWebHistory(""),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      el: "#app",
      top: 0,
      behavior: "smooth"
    };
  }
});

export default router;
