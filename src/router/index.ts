import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import { tokenStorage } from "@/utils/storage";

const routes: Array<RouteRecordRaw> = [
  // 1. 登录页 (不需要侧边栏，所以单独定义) 不需要二级页面嘛
  {
    path: "/login",
    name: "Login",
    // 这样的写法是懒加载 , 实现了 , 按需加载路由组件
    component: () => import("@/views/Login.vue"),
  },
  // 2. 后台主布局 (包含侧边栏的页面都在这里面)a
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/AdminLayout.vue"),
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

  {
    path: "/403",
    name: "Forbidden",
    component: () => import("@/views/error/Forbidden.vue"),
  },
  // 3. 404 页面 (捕获所有未定义的路由)
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/error/NotFound.vue"),
  },
];

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(),
  routes,
});

const whiteList = ["/login", "/404", "/403"];

// 全局前置守卫 当用户访问路由的时候，会先执行这个函数
router.beforeEach((to, from, next) => {
  // to: 即将访问的路由对象
  // from: 从哪个路由来的
  // next: 函数, 用来决定下一步该干嘛
  const token = tokenStorage.get(); // 检测口袋里面有没有通行证
  // 情况 A: 用户已有 Token (已登录)
  if (token) {
    if (to.path === "/login") {
      next("/");
    } else {
      // 放行去其他页面
      next();
    }
  }
  // 情况 B: 用户没有 Token (未登录)
  else {
    // 如果你要去白名单的页面 (比如登录页), 放行
    // 注意: 这里要处理一下 /404 的情况, 防止死循环 , 可以用name匹配或者path匹配
    if (whiteList.includes(to.path) || to.name === "NotFound") {
      next();
    } else {
      // 否则体会登录页
      next("/login");
    }
  }
});

export default router;
