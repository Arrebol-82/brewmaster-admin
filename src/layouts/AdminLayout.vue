<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <!-- aside 是语义化标签 ,表示侧边栏和附属内容 -->
    <aside class="sidebar">
      <h3>BerwMaster</h3>
      <nav>
        <!-- 使用 router-link 进行跳转 -->
        <router-link to="/dashboard">仪表盘</router-link>
        <!-- 当我们点击产品管理的时候，会自动跳转到 /products 路由，然后会自动加载 ProductList.vue 组件 -->
        <router-link to="/products">产品管理</router-link>
        <router-link to="/orders">订单管理</router-link>
      </nav>
    </aside>

    <div class="main-content">
      <!-- 顶栏 -->
      <header class="topbar">
        <span>管理员</span>
        <a href="#">退出</a>
      </header>

      <!-- 内容区: 子路由出口 -->
      <main>
        <!-- 子路由出口 -->
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
main {
  padding: 20px;
}

.admin-layout {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 200px;
  background: #2c3e50;
  color: white;
  padding: 20px;
}
.sidebar a {
  color: white;
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.topbar {
  height: 50px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
</style>
