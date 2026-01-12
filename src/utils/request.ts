import axios from "axios";
// AxiosInstance 是 Axios 的实例类型, AxiosResponse 是 Axios 的响应类型
// AxiosInstance (就是一个泛型)
// AxiosResponse 是 Axios 的响应类型 (也是一个泛型)
import type { AxiosInstance, AxiosResponse } from "axios";
// 导入 Element Plus 的提示框组件
import { ElMessage } from "element-plus";
// 导入 token 存储工具 (浏览器本地存储)
import { tokenStorage } from "./storage";
// 导入 API 响应类型 (规则说明书)
import type { ApiResponse } from "@/types/api";

// 1. 创建 axios 实例
// axios.create 创建自定义路由
const service: AxiosInstance = axios.create({
  // 这里的  import.meta.VITE_API_BASE_URL 是 VIte 的环境变量
  // 如果没有设置 , 默认用 /api
  // baseURL 是请求的根路径
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 5000, // 请求超时时间: 5秒
});

//2. 请求拦截器
// interceptors.request 是 Axios 内置的钩子 (拦截器)
// .use() 是 表示拦截到后执行的代码
// 所以这里的config 也很好理解 就是请求的配置对象
service.interceptors.request.use(
  (config) => {
    // 每次发送请求前 , 先去 storage 里拿 token
    const token = tokenStorage.get();
    if (token) {
      // 如果有 token, 就把他加到请求头里
      // 注意: 标准写法是 "Bearer" + token, 中间有个空格
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 这里的Pormise , 也说明了axios是异步的
    return Promise.reject(error);
  }
);
// 3.响应式拦截器 (Response Interceptor)
// interceptors.response 是 Axios 内置的钩子 (拦截服务器返回的数据)
// response: AxiosResponse<ApiResponse> === 属性名: Array<any>
// 所有返回的请求都会经过这个拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 2xx 范围内的状态码都会触发函数
    const res = response.data;
    if (res.code !== 200) {
      // 如果code不对 , 说明业务代码出错了 , 弹出提示
      ElMessage.error(res.message || "系统繁忙 , 请稍后再试");
      // 特殊情况: 如果code 是 401 (未登录或过期)
      // 我可以你在这里做自动退出逻辑 (day7 会完善)
      if (res.code === 401) {
        tokenStorage.clear();
        window.location.href = "/login"; //强制调回登录页;
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      // 成功! 只返回 data 部分, 让我们写代码更舒服
      return res as any;
    }
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发函数(比如 404, 500)
    console.error("Request Error:", error);
    //可选链
    const message = error.response?.data?.message || "网络请求失败";
    ElMessage.error(message);
    // 这里的401 是 状态码 , 不是 code :属于协议型错误了
    if (error.response?.status === 401) {
      tokenStorage.clear();
      window.location.href = "/login"; //强制调回登录页;
    }
    return Promise.reject(error);
  }
);

export default service;
