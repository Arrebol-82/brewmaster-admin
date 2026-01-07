export type Role = "admin" | "staff"; // 定义角色类型
// 要么是 admin 要么是 staff

export interface User {
  id: number;
  username: string;
  avatar: string;
  roles: Role[]; // 关键: 用户拥有的角色列表
  permissions: string[]; // 关键: 用户拥有的具体权限代码(如 "product:create")
}

// Role[] 表示一个数组里面只能有 admin 或者 staff
// string[] 表示一个数组里面只能有字符串
