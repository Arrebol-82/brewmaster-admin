import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    // 暂时用一个简单的组件占位，后续再创建真实文件
    component: () => import("../App.vue"),
  },
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../App.vue"),
  },
];

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(),
  routes,
});

export default router;
