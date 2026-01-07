// http 是拦截器和监视器 , 用来拦截和监视URL
// HttpResponse 用来模拟返回数据(响应体);
import { http, HttpResponse } from "msw";
export const handlers = [
  // 1. 拦截 POST /api/login 请求
  http.post("/api/login", () => {
    console.log("MSW: 拦截成功!"); // 测试

    //模拟返回一个成功的Token
    // 这里 HttpResponse.json 是用来模拟返回数据(响应体);
    return HttpResponse.json({
      code: 200,
      message: "登录成功 (Mock)",
      data: {
        token: "fake_token_123456", // 这是一个假 Token
        username: "Arrebol",
      },
    });
  }),

  // 2. 拦截GET /api/me 请求 (获取用户信息)
  http.get("/api/me", () => {
    return HttpResponse.json({
      code: 200,
      message: "获取成功",
      data: {
        id: 1,
        username: "admin",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=old_boy",
        // 身份
        roles: ["admin"],
        // 权限
        permissions: ["product:create", "product:delete", "order:view"],
        //创建商品 删除商品 查看订单
      },
    });
  }),
];
