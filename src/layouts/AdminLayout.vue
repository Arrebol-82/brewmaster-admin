<template>
  <!-- 外层容器: 占满全屏 -->
  <el-container class="app-wrapper">
    <!-- 侧边栏 -->
    <!-- aside 是语义化标签 ,表示侧边栏和附属内容 -->
    <el-aside width="220px" class="sidebar-container">
      <div class="logo">BrewMaster</div>
      <!-- 菜单组件: router 属性开启路由模式 -->
      <!-- active-text-color 当文字颜色被激活时，文字颜色为黄色 -->
      <!-- 只要这里写了 router 属性 , 那么 el-menu-item 的 index 属性就会自动被路由路劲替换 , 不再是普通路径了 -->
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="/dashboard"
        text-color="#fff"
        router
      >
        <!-- 菜单项: 1: 仪表盘 -->
        <!-- index 设置为路由路劲 , 点击自动跳转 -->
        <el-menu-item index="/dashboard"><span>📊 仪表盘</span></el-menu-item>
        <el-menu-item index="/products"><span>☕ 产品管理</span></el-menu-item>
        <el-menu-item index="/orders"><span>🧾 订单管理</span></el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧: 主体区域 -->
    <el-container>
      <!-- 顶栏 -->
      <!-- header 是语义化标签 ,表示顶栏和头部内容 -->
      <el-header class="header">
        <div class="header-content">
          <span>管理员</span>
          <el-button type="danger" size="small">退出登录</el-button>
        </div>
      </el-header>

      <!-- 内容区: 子路由出口 用来展示子路由页面-->
      <!-- main 是语义化标签 ,表示主要内容 -->
      <el-main class="main-content">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
/* 让容器占满屏幕高度 */
.app-wrapper {
  height: 100vh;
  display: flex;
}
.sidebar-container {
  background-color: #545c64;
  height: 100%;
  overflow-y: auto;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  background-color: #434a50;
}

/* 去除菜单右侧默认边框 */
.el-menu {
  border-right: none;
}
.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 内容靠右对齐 */
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 14px;
}

.header-content span {
  margin-right: 15px;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
