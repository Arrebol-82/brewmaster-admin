// setupWorker 是用来创建一个模拟服务器实例
import { setupWorker } from "msw/browser";
// handlers 是用来模拟返回数据(响应体);
import { handlers } from "./handlers";

// ...handlers 是用来模拟返回数据(响应体);
// setupWorker 是专门用来初始化浏览器端的拦截器
// 这里用 ...handlers 是因为 setupWorker 不接受数组, 只接受一个个参数
export const worker = setupWorker(...handlers);
