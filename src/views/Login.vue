<template>
  <div class="login-container">
    <!-- el-card 就是一个高级卡片组件 , 高级的div  -->
    <el-card class="login-card" shadow="hover">
      <template #header>
        <h2 class="login-title">BrewMaster Admin</h2>
      </template>

      <!-- 登录表单 -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
        <!-- model 绑定表单数据 rules 绑定表单验证规则 label-width 设置表单项的宽度为0，自适应内容宽度 ref 绑定表单引用 -->
        <el-form-item prop="username">
          <!--           prop 的字符串值，必须和 form 里的属性名、以及 rules
          里的规则名，写得一模一样（大小写都要对上）！ -->
          <el-input
            v-model="form.username"
            placeholder="用户名 (随便填)"
            :prefix-icon="User"
          />
          <!-- prefix-icon 设置前缀图标 -->
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码 (随便填)"
            :prefix-icon="Lock"
            show-password
          />
          <!-- show-password 小眼睛 -->
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
            >立即登录</el-button
          >
          <!-- type="primary" 设置按钮类型为主要按钮 -->
          <!-- :loading="loading" 设置按钮加载状态:防止用户重复点击按钮 -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";

// 路由实例 用于跳转页面 , 之所以不用window.location.href 是因为vue-router  响应快 , 不白屏
const router = useRouter();
// 这是我用pinia创建的authStore实例
const authStore = useAuthStore();

const loading = ref(false);
const formRef = ref();

//表单数据
const form = reactive({
  username: "admin",
  password: "123",
});
// 表单验证规则
const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  // required: true 表示必填 , message 表示错误提示 , trigger 表示触发验证的事件 , blur 表示失去焦点时触发
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLogin = async () => {
  // 1. 先校验表单
  // 如果表单校验通过，则继续执行登录操作，否则返回中断函数执行
  if (!formRef.value) return;
  // value.validate他会去检测rules里面的规则看是否通过
  await formRef.value.validate(async (valid: boolean) => {
    // 这里的valid是表单校验的结果，如果为true，则表示表单校验通过，否则表示表单校验不通过
    if (valid) {
      loading.value = true;
      // 设置按钮加载状态为true，防止用户重复点击按钮
      try {
        // 2. 调用 Pinia 的 login action
        await authStore.login(form);

        ElMessage.success("登录成功，欢迎回来！");
        // 3. 跳转到首页
        router.push("/dashboard");
      } catch (error) {
        // 错误已经在 request.ts 拦截器里弹窗了，这里可以不处理，或者做些清理工作
        console.error(error);
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}
.login-card {
  width: 400px;
  border-radius: 8px;
}

.login-title {
  text-align: center;
  margin: 0;
  color: #303133;
}
.login-btn {
  width: 100%;
}
</style>
