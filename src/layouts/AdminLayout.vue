<!-- src/layouts/AdmniLayout.vue  -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 1. 爸爸把儿子请进来: 左侧边栏 -->
      <!-- 这里直接组件标签, 不需要路由跳转 -->
      <el-aside widht="200px">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header>Header (顶栏)</el-header>
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
</script>
