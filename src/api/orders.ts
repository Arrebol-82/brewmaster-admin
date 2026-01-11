import request from "@/utils/request";
import type { PageResult } from "@/types/product";
import type { Order, OrderQuery } from "@/types/order";

export function getOrderList(params: OrderQuery) {
  return request.get<PageResult<Order>>("/orders", { params });
}
