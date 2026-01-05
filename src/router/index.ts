import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // 1. 登录页 (不需要侧边栏，所以单独定义) 不需要二级页面嘛
  {
    path: "/login",
    name: "Login",
    // 这样的写法是懒加载 , 实现了 , 按需加载路由组件
    component: () => import("../views/Login.vue"),
  },
  // 2. 后台主布局 (包含侧边栏的页面都在这里面)
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("../layouts/AdminLayout.vue"),
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/Dashboard.vue"),
      },
      {
        path: "products",
        name: "Products",
        component: () => import("../views/products/ProductList.vue"),
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("../views/orders/OrderList.vue"),
      },
    ],
  },
  // 3. 404 页面 (捕获所有未定义的路由)
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/error/NotFound.vue"),
  },
];

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(),
  routes,
});

export default router;
