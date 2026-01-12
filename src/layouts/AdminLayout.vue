<!-- src/layouts/AdmniLayout.vue  -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 1. 爸爸把儿子请进来: 左侧边栏 -->
      <!-- 这里直接组件标签, 不需要路由跳转 -->
      <el-aside>
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header class="admin-header">
          <div class="header-content">
            <span>当前身份: {{ name }}</span>
            <el-button type="danger" size="small" @click="logout"
              >退出登录</el-button
            >
          </div>
        </el-header>
        <el-main>
          <!-- 核心: 这里是路由实体组件显示的地方 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const router = useRouter();
const name = authStore.userRole;

function logout() {
  authStore.logout();
  router.replace("/login");
}
</script>
<style scoped>
.el-aside {
  width: 230px;
}

.el-main {
  padding-left: 40px;
}

.common-layout {
  display: flex;
}

.admin-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6; /* 加一条淡淡的底边线 */
  display: flex;
  align-items: center; /* 垂直居中 */
  color: #333;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between; /* 让文字在左，按钮在右 */
  align-items: center;
}
</style>
