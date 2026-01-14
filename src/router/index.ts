import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import { tokenStorage } from "@/utils/storage";
import { useAuthStore } from "@/stores/auth";
import { type Role } from "@/types/user";
import { ElMessage } from "element-plus";

const routes: Array<RouteRecordRaw> = [
  // 1. 登录页 (不需要侧边栏，所以单独定义) 不需要二级页面嘛
  {
    path: "/login",
    name: "Login",
    // 这样的写法是懒加载 , 实现了 , 按需加载路由组件
    component: () => import("@/views/Login.vue"),
  },
  // 2. 后台主布局 (包含侧边栏的页面都在这里面)
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/AdminLayout.vue"),
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard.vue"),
        // 所有人都能访问仪表盘
        meta: { title: "仪表盘" },
      },
      {
        path: "products",
        name: "Products",
        component: () => import("@/views/products/ProductList.vue"),
        // 只有 admin 才能访问产品管理
        meta: { title: "产品管理", roles: ["admin"] },
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("@/views/orders/OrderList.vue"),
        // 都能访问订单管理
        meta: { title: "订单管理", roles: ["admin", "staff"] },
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

const whiteList = ["/login", "/403"];

// 全局前置守卫 当用户访问路由的时候，会先执行这个函数
router.beforeEach(async (to, from, next) => {
  // to: 即将访问的路由对象
  // from: 从哪个路由来的
  // next: 函数, 用来决定下一步该干嘛
  const token = tokenStorage.get(); // 检测口袋里面有没有通行证
  const authStore = useAuthStore();
  // 情况 A: 用户已有 Token (已登录)
  if (token) {
    if (to.path === "/login") {
      next("/");
    } else {
      // 放行去其他页面
      if (!authStore.user) {
        try {
          await authStore.fetchUser(); // 补发请求,恢复数据
          // ❌ 重点!!!!：这里千万不要写 next()！！！
          // ❌ 删掉这里的 next()，让代码继续往下走去检查权限!!!
          //  Vue Router 的机制是：一次路由导航（Navigation），只能接受一次状态变更。
        } catch (error) {
          // 如果 Token 过期了或获取失败
          console.error("❌ 用户信息获取失败:", error);
          ElMessage.error("身份已过期，请重新登录");
          authStore.logout();
          next("/login");
          return;
        }
      }
      // 获取该页面要求的角色列表 (从 meta.roles 里拿) 上面路由已经配置好了
      // as string[] 是告诉 TS：我确定这里面存的是字符串数组 | undefined 是告诉 TS：我可能没有这个角色列表
      const requiredRoles = to.meta.roles as string[] | undefined;
      if (
        // 如果该页面有要求角色列表 , 并且用户没有这个角色列表 , 那么就踢回登录页
        requiredRoles &&
        !requiredRoles.some((role) => authStore.roles.includes(role as Role))
      ) {
        console.warn(
          `🛑 权限不足: 当前角色 ${authStore.roles} 试图访问 ${to.path}`
        );
        next("/403");
        return;
      } else {
        next();
      }
    }
  }
  // 情况 B: 用户没有 Token (未登录)
  else {
    // 如果你要去白名单的页面 (比如登录页), 放行
    // 注意: 这里要处理一下 /404 的情况, 防止死循环 , 可以用name匹配或者path匹配
    if (whiteList.includes(to.path) || to.name === "NotFound") {
      next();
    } else {
      // 否则踢回登录页
      next("/login");
    }
  }
});

export default router;
