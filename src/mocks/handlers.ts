// http 是拦截器和监视器 , 用来拦截和监视URL
// HttpResponse 用来模拟返回数据(响应体);
/* import { http, HttpResponse, delay } from "msw";
import type { Product } from "@/types/product"; */

import { authHandlers } from "./modules/auth";
import { productHandlers } from "./modules/product";
import { orderHandlers } from "./modules/order";

export const handlers = [...authHandlers, ...productHandlers, ...orderHandlers];
