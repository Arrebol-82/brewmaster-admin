import request from "@/utils/request";
import type {
  Product,
  ProductQuery,
  PageResult,
  ProductCreateDTO,
  ProductUpdateDTO,
} from "@/types/product";
import type { ApiResponse } from "@/types/api";
// Product 是类型 , 所以用 type 关键字 接收

// 获取商品列表
export function getProductList(params: ProductQuery) {
  // 泛型 <PageResult<Product>> 告诉TS 返回值 data 的结构
  return request.get<any, ApiResponse<PageResult<Product>>>("/products", {
    params,
  });
}

// 1. 新增商品
export function createProduct(payload: ProductCreateDTO) {
  return request.post<void>("/products", payload);
}

// 2. 编辑商品 (PUT)
// 需要id定位, payload 是更新的数据
export function updateProduct(id: number, payload: ProductUpdateDTO) {
  return request.put<void>(`/products/${id}`, payload);
}

// 3. 删除商品
export function deleteProduct(id: number) {
  return request.delete<void>(`/products/${id}`);
}
