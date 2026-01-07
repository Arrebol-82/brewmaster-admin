<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
</script>

<template>
  <div class="dashboard">
    <h1>仪表盘</h1>

    <!-- 测试权限显示 -->
    <!-- 理解了 auth.ts文件 , 下面的代码自然能看懂 -->
    <el-card>
      <p>当前用户: {{ authStore.user?.username }}</p>
      <p>角色列表: {{ authStore.roles }}</p>

      <!-- 只有 admin 才能看到这个按钮 -->
      <el-button v-if="authStore.hasRole('admin')" type="danger"
        >删除数据库 (Admin 专属)</el-button
      >
      <!-- 只有 staff 才能看到这个按钮: -->
      <el-button v-if="authStore.hasRole('staff')" type="success"
        >查看订单 (Staff 专属)</el-button
      >
    </el-card>
  </div>
</template>
