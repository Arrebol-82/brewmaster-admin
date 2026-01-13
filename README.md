# ☕ BrewMaster Admin (咖啡店后台管理系统)

![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat&logo=vite)
![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-409eff?style=flat&logo=element)
![Pinia](https://img.shields.io/badge/Pinia-2.x-ffd11b?style=flat&logo=pinia)

> 一个基于 Vue 3 + TypeScript + Element Plus 的现代化后台管理系统实战项目。
> 模拟了真实的咖啡店 SaaS 业务场景，包含完整的权限管理（RBAC）、数据 Mock 和 CRUD 业务流。

## ✨ 核心功能

- **🔐 极致的权限控制**

  - 支持 **RBAC 角色权限**：`Admin` (店长) 和 `Staff` (店员) 拥有不同的菜单和按钮权限。
  - **路由守卫**：未登录拦截、Token 自动校验、无权访问自动跳转 403。
  - **无感刷新**：页面刷新后自动恢复用户状态 (Pinia + LocalStorage)。

- **🛍️ 业务模块闭环**

  - **商品管理**：支持分页查询、关键词模糊搜索、状态筛选。
  - **订单管理**：模拟真实订单流，支持状态标签渲染 (待支付/已完成等)。
  - **数据 Mock**：集成 **MSW (Mock Service Worker)**，拦截 XHR 请求，脱离后端独立开发。

- **🛠️ 工程化最佳实践**
  - **TypeScript**：全量类型定义 (Product/Order/User)，消灭 `any`。
  - **Axios 封装**：统一拦截请求/响应，全局处理 401/500 错误。
  - **路径别名**：统一使用 `@/*` 路径，结构清晰。

## 🚀 快速开始

本项目内置了 MSW Mock 服务，**Clone 下来即可直接运行**，无需配置后端服务器。

### 1. 安装依赖

```bash
npm install
2. 启动开发服务器
npm run dev
3. 登录演示账号 (Mock)
系统内置了以下两个测试账号，可用于体验不同的权限视角：
角色
用户名
密码
权限说明
👑 Admin (店长)
admin
123456
最高权限。可查看所有菜单，可操作"删除/编辑"按钮。
🧑‍🍳 Staff (店员)
staff
123456
受限权限。不可见"权限管理"菜单，不可见"删除"按钮。
📂 项目目录结构
src/
├── api/             # API 接口定义 (axios请求)
├── layouts/         # 布局组件 (Sidebar/Header)
├── mocks/           # MSW Mock 数据处理器 (核心假数据)
├── router/          # 路由配置与全局守卫
├── stores/          # Pinia 状态管理 (Auth/Cart)
├── types/           # TypeScript 类型定义 (*.d.ts)
├── utils/           # 工具库 (Request/Storage)
└── views/           # 页面文件
    ├── login/       # 登录页
    ├── products/    # 商品列表 (CRUD)
    └── orders/      # 订单列表
🤝 贡献与反馈
如果你觉得这个项目对你有帮助，欢迎点个 ⭐️ Star！
```
