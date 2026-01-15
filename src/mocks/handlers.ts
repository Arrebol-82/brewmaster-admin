// http 是拦截器和监视器 , 用来拦截和监视URL
// HttpResponse 用来模拟返回数据(响应体);
import { http, HttpResponse, delay } from "msw";
import type { Product } from "@/types/product";
// map 创建出来的数组会把原来的给替换掉
let dbProducts: Product[] = Array.from({ length: 25 }).map((_, index) => ({
  id: index + 1,
  name: `香草拿铁咖啡 ${index + 1}号`,
  price: 2800 + index * 100, // 2800分 = 28元
  status: index % 3 === 0 ? "on_sale" : "sold_out", // 0 是上架 , 1 是下架
  stock: 10 + index, // 库存
  createTime: "2026-01-08",
}));
let allOrders = Array.from({ length: 55 }).map((_, index) => {
  const statusList = ["pending", "paid", "shipped", "completed", "cancelled"];
  return {
    id: index + 1,
    orderNo: `ORDER${20260000 + index}`,
    totalAmount: Math.floor(Math.random() * 1000) + 1000,
    status: statusList[index % 5],
    createTime: "2026-01-11 15:18:15",
  };
});
export const handlers = [
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

  // products 商品管理 -----------------------------------
  http.get("/api/products", async ({ request }) => {
    // 模拟网络延迟 500ms 让你看到 loading 效果
    await delay(1000);

    const url = new URL(request.url); // 获取请求URL 指的是这个请求要飞往哪里。
    // new URL 这个对象有一个 searchParams 属性 , 专门用来装 ? 后面的参数 并且把我们整理好了
    // url.searchParams 专门用来装 ? 后面的参数上面说的
    // 页码
    const page = Number(url.searchParams.get("page")) || 1;
    // 每页条数
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    // 搜索关键词
    const keyword = url.searchParams.get("keyword") || "";

    const status = url.searchParams.get("status") || "";

    // 2. 模拟搜索 (简单的模糊匹配)
    let filteredList = dbProducts;
    // 如果搜索关键词不为空 , 则过滤掉不符合关键词的商品
    if (keyword) {
      filteredList = filteredList.filter((item) => item.name.includes(keyword));
    }
    if (status) {
      // 过滤
      filteredList = filteredList.filter((item) => item.status === status);
    }

    const total = filteredList.length;

    // 3. 模拟分页 (Slice 切割数组)
    // 计算起始商品索引
    const start = (page - 1) * pageSize;
    // 计算结束商品索引
    const end = start + pageSize;
    // 这里的pageList 是咖啡的数量 , 记住是咖啡的数量
    const pageList = filteredList.slice(start, end);

    //4. 返回标准分页结构
    return HttpResponse.json({
      code: 200,
      message: "success",
      data: {
        list: pageList, // 返回的是需要展示在页面上的咖啡 , 不是咖啡的总数量
        total: total, // 告诉前端总共有多少条咖啡
      },
    });
  }),

  // 新增商品
  http.post("/api/products", async ({ request }) => {
    await delay(500); // 模拟网络延迟
    // 获取前端传过来的 JSON 数据
    // 注意：request.json() 返回的是 Promise
    const newProduct = (await request.json()) as any;

    // 模拟后端生成 id 和 创建时间
    const productObj: Product = {
      id: dbProducts.length > 0 ? dbProducts[dbProducts.length - 1]!.id + 1 : 1, // 自增ID
      createTime: new Date().toLocaleString(),
      ...newProduct, // 展开前端传来的 name, price 等字段
    };

    // 推入内存数组
    dbProducts.unshift(productObj); // 跟push的区别就是一个是放在最前面，一个是放在最后面
    return HttpResponse.json({
      code: 200,
      message: "创建成功",
      data: null,
    });
  }),

  //2. 编辑商品 (PUT)
  http.put("/api/products/:id", async ({ params, request }) => {
    await delay(500); // 模拟网络延迟
    const id = Number(params.id);
    const updateData = (await request.json()) as any;

    //在数组里面找到这个商品
    const index = dbProducts.findIndex((p) => p.id === id);
    // findIndex 会去找到商品的 id 是否和 id 相等 , 如果相等就返回索引 , 如果不相等就返回 -1
    if (index !== -1) {
      // 更新数据 (合并旧数据和新数据)
      dbProducts[index] = { ...dbProducts[index], ...updateData };

      return HttpResponse.json({
        code: 200,
        message: "更新成功",
        data: dbProducts[index],
      });
    }
    return HttpResponse.json(
      { code: 404, message: "商品不存在", data: null }, // 给前端用的
      { status: 404 } //给axios和浏览器用的
    );
  }),
  //3. 删除商品
  http.delete("/api/products/:id", async ({ params }) => {
    await delay(500); // 模拟网络延迟
    const id = Number(params.id);

    // 过滤掉这个 ID 的商品
    // filter 的逻辑不是“找出要删的”，而是“保留想要的”。
    dbProducts = dbProducts.filter((p) => p.id !== id);
    return HttpResponse.json({
      code: 200,
      message: "删除成功",
      data: null,
    });
  }),

  // orders 订单 -----------------------------------
  http.get("/api/orders", async ({ request }) => {
    // 模拟网络延迟 500ms 让你看到 loading 效果
    await delay(1000);

    const url = new URL(request.url); // 获取请求URL 指的是这个请求要飞往哪里。
    // new URL 这个对象有一个 searchParams 属性 , 专门用来装 ? 后面的参数 并且把我们整理好了
    // url.searchParams 专门用来装 ? 后面的参数上面说的
    // 页码
    const page = Number(url.searchParams.get("page")) || 1;
    // 每页条数
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    // 搜索关键词
    const keyword = url.searchParams.get("keyword") || "";

    // 状态匹配
    const status = url.searchParams.get("status") || "";

    // 2. 模拟搜索 (简单的模糊匹配)
    let resultList = allOrders;

    // 模糊关键词搜索
    if (keyword) {
      resultList = resultList.filter((item) => item.orderNo.includes(keyword));
    }

    if (status) {
      // 过滤
      resultList = resultList.filter((item) => item.status === status);
    }

    const total = resultList.length;

    // 3. 模拟分页 (Slice 切割数组)
    // 计算起始商品索引
    const start = (page - 1) * pageSize;
    // 计算结束商品索引
    const end = start + pageSize;
    // 这里的pageList 是咖啡的数量 , 记住是咖啡的数量
    const pageList = resultList.slice(start, end);

    //4. 返回标准分页结构
    return HttpResponse.json({
      code: 200,
      message: "success",
      data: {
        list: pageList, // 返回的是需要展示在页面上的咖啡 , 不是咖啡的总数量
        total: total, // 告诉前端总共有多少条咖啡
      },
    });
  }),
];
