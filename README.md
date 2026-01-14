# ☕ BrewMaster Admin (咖啡店后台管理系统)

![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat&logo=vite)
![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-409eff?style=flat&logo=element)
![Pinia](https://img.shields.io/badge/Pinia-2.x-ffd11b?style=flat&logo=pinia)

> 一个基于 Vue 3 + TypeScript + Element Plus 的现代化后台管理系统实战项目。
> 模拟了真实的咖啡店 SaaS 业务场景，包含完整的权限管理（RBAC）、数据 Mock 和 CRUD 业务流。

基于 Vue 3 + TypeScript + Vite + Element Plus 的现代化后台管理系统。
本项目演示了从零构建企业级中后台的全过程，包含完整的鉴权、动态路由、Mock 数据流和 CRUD 封装。

## ✨ 当前进度

- **🔐 权限管理** : 完整的登录流程，基于角色的动态路由 (Admin/Staff)，按钮级权限控制。
- **📦 商品管理** : 完整的 CRUD 操作。
  - 封装了 `useTable` Hook，实现分页、搜索、Loading 自动化。
  - 复用 `ProductFormDialog`，实现新增与编辑一体化。
  - 包含表单校验、删除二次确认等交互细节。
- **📡 网络层** : Axios 二次封装 + MSW (Mock Service Worker) 拦截，脱离后端独立开发。

## 🚀 快速开始

1. **安装依赖**
   ```bash
   npm install
   ```
2. 启动开发服务器
3. 测试账号 (Mock)
   ◦ 管理员 (Admin): 拥有所有权限
   ▪ 账号: admin / 密码: 123456
   ◦ 店员 (Staff): 无法删除商品，无法看见系统管理
   ▪ 账号: staff / 密码: 123456
   🛠 技术栈
   • Vue 3 (Script Setup)
   • TypeScript
   • Pinia (状态管理)
   • Vue Router (动态路由)
   • Element Plus (UI 组件库)
