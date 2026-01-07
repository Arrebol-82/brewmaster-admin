import { defineStore } from "pinia";
import { ref } from "vue";
import service from "../utils/request";
import { tokenStorage } from "../utils/storage";
import type { ApiResponse } from "../types/api";

// 定义 User 接口(根据day5的 Mock数据)
interface User {
  id: number;
  username: string;
  role: string;
  avatar: string;
}

export const useAuthStore = defineStore("auth", () => {
  // 1. State(状态)
  const token = ref<string | null>(tokenStorage.get());
  const user = ref<User | null>(null);

  // 2. Actions(动作)

  // 登录动作
  const login = async (loginForm: any) => {
    // 发送请求 (这里的 /login 会被 MSW 拦截)
    const res = await service.post<any, ApiResponse<{ token: string }>>(
      "/login",
      loginForm
    );

    // 拿到 token
    // 这里只需要一层data , 是因为此时res 的数据是经过拦截器拦截后的数据 , 在里面已经解构了一个data了
    const accessToken = res.data.token;
    // token是我们设置好的
    token.value = accessToken;
    // 把他存入到浏览器的本地存储中
    tokenStorage.set(accessToken);

    // 登录成功后, 获取用户信息
    await fetchUser();
  };

  // 获取用户信息
  const fetchUser = async () => {
    // 跟上面是一个道理
    const res = await service.get<any, ApiResponse<User>>("/me");
    user.value = res.data;
  };

  // 退出登录动作
  const logout = () => {
    token.value = null;
    user.value = null;
    tokenStorage.clear();
    // 这里可以加一个路由跳转 , 跳转到登录页
    window.location.href = "/login";
  };
  return {
    token,
    user,
    login,
    fetchUser,
    logout,
  };
});
