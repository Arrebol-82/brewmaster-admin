// 写一个泛型接口
export interface ApiResponse<T = any> {
  // 业务状态码
  code: number;
  // 给后端的提示信息, 比如 "登录成功"
  message: string;
  // 数据体, 比如 "用户信息"
  data: T;
}
