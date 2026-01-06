import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
// 这一行非常重要！如果不加，你的按钮和表格就是光秃秃的 HTML 原生丑样子，没有样式
import "element-plus/dist/index.css";
import router from "./router";
import request from "./utils/request";

import "./style.css";
import App from "./App.vue";

const app = createApp(App);
// 创建应用实例 , APP 是根组件 , 所有的子组件都在 APP 组件内渲染

// 注册 Pinia
app.use(createPinia());

// 注册 Element Plus
app.use(ElementPlus);
app.use(router);

console.log("Axios instance loaded:", request);

// 挂载应用
app.mount("#app");
/* 他告诉Vue把处理好的代码挂载到HTML 中 id 为 app 的那个容器里面, 所以你可以在根目录
的index.html 里面看到有一个 <div id="app"></div> 标签 */
