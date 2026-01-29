import { http, HttpResponse, delay } from "msw";
import type { OrderDetail, OrderStaus } from "@/types/order";

// map 创建出来的数组会把原来的给替换掉

let allOrders = Array.from({ length: 55 }).map((_, index): OrderDetail => {
  const statusList: OrderStaus[] = [
    "pending",
    "paid",
    "shipped",
    "completed",
    "cancelled",
  ];
  return {
    id: index + 1,
    order: `ORDER${20260000 + index}`,
    totalAmount: Math.floor(Math.random() * 1000) + 1000,
    status: statusList[index % 5]!,
    createTime: new Date(Date.now() - index * 864000000).toLocaleString(),
    items: [
      {
        id: index + 1,
        name: `香草拿铁咖啡 ${index + 1}号`,
        price: 2800 + index * 100,
        count: 1,
      },
      {
        id: index + 2,
        name: `香草拿铁咖啡 ${index + 2}号`,
        price: 2800 + index * 100,
        count: 2,
      },
    ],
    logs: [
      {
        id: index + 1,
        action: "创建订单",
        operator: "系统",
        createTime: new Date(Date.now() - index * 864000000).toLocaleString(),
      },
    ],
  };
});

export const orderHandlers = [
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
      resultList = resultList.filter((item) => item.order.includes(keyword));
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

  // 获取订单详情 -----------------------------------
  http.get("/api/orders/:id", async ({ params }) => {
    await delay(200);
    const id = Number(params.id);
    const order = allOrders.find((item) => item.id === id);

    if (!order) {
      return HttpResponse.json({
        code: 404,
        message: "订单不存在",
        data: null,
      });
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      data: order,
    });
  }),

  // 更新订单状态 -----------------------------------
  http.post("/api/orders/:id/status", async ({ params, request }) => {
    await delay(500);
    const id = Number(params.id);
    // 获取前端传来的 { status: "shipped" }
    const body = (await request.json()) as { status: OrderStaus };

    const order = allOrders.find((item) => item.id === id);

    if (!order) {
      return HttpResponse.json({ code: 404, message: "订单不存在" });
    }

    if (order) {
      // 核心业务逻辑: 该状态 + 加日志
      const oldStatus = order.status;
      order.status = body.status;
      order.logs.push({
        id: Date.now(),
        action: `状态更新: ${oldStatus} -> ${body.status}`,
        operator: "Admin", // 暂时先写死 , 以后可以从 Token 中解析
        createTime: new Date().toLocaleString(),
      });
    }



    return HttpResponse.json({
      code: 200,
      message: "状态更新成功",
      data: null,
    });
  }),
];
