<template>
  <div class="not-found-container">
    <el-result
      icon="error"
      title="403"
      sub-title="哎呦 , 你没有权限访问这个页面 🚫"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/')"
          >返回首页</el-button
        >
      </template>
    </el-result>
  </div>
</template>
<style scoped>
.not-found-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-color: #fff;
}
</style>
