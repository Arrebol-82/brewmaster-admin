import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
// 这一行非常重要！如果不加，你的按钮和表格就是光秃秃的 HTML 原生丑样子，没有样式
import "element-plus/dist/index.css";
import router from "./router";
import request from "./utils/request";

import "./style.css";
import App from "./App.vue";

console.log("Axios instance loaded:", request);
async function enableMocking() {
  // 这里的 import.meta.env.DEV 是 Vite 提供的环境变量
  if (import.meta.env.DEV) {
    // 动态引入: 只有在开发时才会加载这个文件, 打包上线时不会把 mock 代码打包进去
    const { worker } = await import("./mocks/browser");
    // 启动 Service Worker
    // worker.start()就是启动拦截器;
    // onUnandledRequset: 'bypass' 意思是: 如果遇到没定义的接口,就直接放行 (不报错),让他走正常的请求流程
    return worker.start({ onUnhandledRequest: "bypass" });
  }
}

enableMocking().then(() => {
  // 创建应用实例 , APP 是根组件 , 所有的子组件都在 APP 组件内渲染
  const app = createApp(App);
  // 注册 Pinia
  app.use(createPinia());

  // 注册 Element Plus
  app.use(ElementPlus);
  app.use(router);
  // 挂载应用
  app.mount("#app");
  /* 他告诉Vue把处理好的代码挂载到HTML 中 id 为 app 的那个容器里面, 所以你可以在根目录
的index.html 里面看到有一个 <div id="app"></div> 标签 */
});
