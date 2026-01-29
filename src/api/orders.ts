import request from "@/utils/request";
import type { PageResult } from "@/types/product";
import type { OrderDetail, Order, OrderQuery, OrderStaus } from "@/types/order";
import type { ApiResponse } from "@/types/api";

export function getOrderList(params: OrderQuery) {
  return request.get<any, ApiResponse<PageResult<Order>>>("/orders", {
    params,
  });
}

// 2. 获取订单详情 (包含商品明细和日志)
export const getOrderDetail = (id: number) => {
  return request.get<OrderDetail>(`/orders/${id}`);
};

// 3. 修改订单状态
export const updateOrderStatus = (id: number, status: OrderStaus) => {
  //这里的 status 放在 body 里传给后端
  return request.post<null>(`/orders/${id}/status`, { status });
};
