import { http, HttpResponse } from "msw";

export const authHandlers = [
  // 1. 拦截 POST /api/login 请求
  http.post("/api/login", async ({ request }) => {
    // request 返回的响应体 , 是一个 Request 对象
    const body = (await request.json()) as any;
    // 直接拿是拿不到的  , 所以要用到 request.json()

    if (body.username === "admin") {
      //模拟返回一个成功的Token
      // 这里 HttpResponse.json 是用来模拟返回数据(响应体);
      return HttpResponse.json({
        code: 200,
        message: "登录成功 (Mock)",
        data: {
          token: "admin-token", // 这是一个假 Token
          username: "Admin User",
        },
      });
    }
    // 如果是 staff 登录
    if (body.username === "staff") {
      return HttpResponse.json({
        code: 200,
        message: "登录成功 (Mock)",
        data: {
          token: "staff-token", // 这是一个假 Token
          username: "Staff User",
        },
      });
    }

    // 上线了 , 记得删除这段代码
    return HttpResponse.json({
      code: 200,
      message: "登录成功",
      data: { token: "admin-token" },
    });
  }),

  // 2. 拦截GET /api/me 请求 (获取用户信息)
  http.get("/api/me", ({ request }) => {
    const token = request.headers.get("Authorization");
    // 如果没有 Token ， 返回 401 未授权
    if (!token) {
      return new HttpResponse(null, { status: 401 }); // 401 未授权 这段代码会让index.ts 触发 catch
    }

    // 3. 模拟 Admin 账号 (拥有至高无上的权力)
    if (token.startsWith("Bearer ") && token.includes("admin-token")) {
      return HttpResponse.json({
        code: 200,
        message: "获取成功",
        data: {
          id: 1,
          username: "Admin User",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=old_boy",
          // 身份
          roles: ["admin"],
          // 权限
          permissions: [
            "product:create",
            "product:edit",
            "product:delete",
            "order:create",
            "order:delete",
          ],
          //创建商品 编辑商品 删除商品
        },
      });
    }
    if (token.startsWith("Bearer ") && token.includes("staff-token")) {
      // 4. 模拟 Staff 账号 (权限受限)
      return HttpResponse.json({
        code: 200,
        message: "获取成功",
        data: {
          id: 2,
          username: "Staff User",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=boy",
          // 身份
          roles: ["staff"],
          // 权限
          permissions: ["product:read"],
          //只能查看商品
        },
      });
    }

    // 如果 Token 既不是 admin 也不是 staff
    return new HttpResponse(null, { status: 401 }); // 跟上面是同理的
  }),
];
