<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // 引入我们写好的 pinia 仓库实例
import { type Role } from "@/types/user";

// 获取路由和仓库实列
const route = useRoute();
const authStore = useAuthStore();

// 1. 定义菜单的数据结果 （TypeScript 接口）
interface MenuItem {
  title: string;
  path: string;
  icon?: string; //图标名称
  roles?: string[]; // 角色权限
}

// 2. 菜单配置项 （这就是地图）
const menuList: MenuItem[] = [
  {
    title: "📊 仪表盘",
    path: "/dashboard",
  },
  {
    title: "☕ 产品管理",
    path: "/products",
    roles: ["admin"],
  },
  {
    title: "🧾 订单管理",
    path: "/orders",
    roles: ["admin", "staff"],
  },
  { title: "💰 财务统计", path: "/finance", roles: ["admin"] },
];

// 3. 核心逻辑: 过滤当前用户能看到的菜单
const visibleMenus = computed(() => {
  return menuList.filter((item) => {
    // 情况A 菜单没有权限规则 (roles 为空或 undefined) -> 直接放行
    if (!item.roles || item.roles.length === 0) return true;

    // 情况B 菜单有权限规则 -> 检查用户角色是否匹配
    // authStore.roles 是当前用户的角色数组 (如 ['staff'])
    // item.roles 是菜单允许的角色数组 (如 ['admin'])
    // 用 .some() 判断是否有交集
    // 跟昨晚写的 index.ts 是一样的
    return item.roles.some((role) => authStore.roles.includes(role as Role));
  });
});

const activeMenu = computed(() => route.path); // 当前激活的菜单项
</script>
<template>
  <el-aside width="230px" class="sidebar-container">
    <el-menu
      :default-active="activeMenu"
      router
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- 标题或 Logo -->
      <div class="logo-area">
        <h3>☕ BrewMaster</h3>
      </div>

      <el-menu-item
        v-for="item in visibleMenus"
        :key="item.path"
        :index="item.path"
      >
        <!-- 如果你以后想用 Element Plus 的 Icon 组件，可以在这里扩展 -->
        <!-- <el-icon><component :is="item.icon" /></el-icon> -->
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.sidebar-container {
  height: 100vh;
  background-color: #545c64;
}

.el-menu-vertical-demo {
  border-right: none; /*去掉 Element 菜单默认的右边框*/
}

.logo-area {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: white;
  border-bottom: 1px solid #666;
}
</style>
