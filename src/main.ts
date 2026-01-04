import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router";

import "./style.css";
import App from "./App.vue";

const app = createApp(App);

// 注册 Pinia
app.use(createPinia());

// 注册 Element Plus
app.use(ElementPlus);
// app.use(router);

// 挂载应用
app.mount("#app");
