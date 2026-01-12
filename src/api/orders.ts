import request from "@/utils/request";
import type { PageResult } from "@/types/product";
import type { Order, OrderQuery } from "@/types/order";
import type { ApiResponse } from "@/types/api";

export function getOrderList(params: OrderQuery) {
  return request.get<any, ApiResponse<PageResult<Order>>>("/orders", {
    params,
  });
}
