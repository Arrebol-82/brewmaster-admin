import request from "@/utils/request";
import type { Product, ProductQuery, PageResult } from "@/types/product";
// Product 是类型 , 所以用 type 关键字 接收

// 获取商品列表
export function getProductList(params: ProductQuery) {
  // 泛型 <PageResult<Product>> 告诉TS 返回值 data 的结构
  return request.get<PageResult<Product>>("/products", { params });
}
