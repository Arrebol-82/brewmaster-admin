// 1. 商品单体结构
export interface Product {
  id: number;
  name: string;
  price: number; // 单位: 分 , 后端通常存整数
  status: "on_sale" | "sold_out"; // 上架 下架
  stock: number; // 库存
  createTime: string; // 创建时间
}
// 2. 商品列表结构 (搜索框用)
export interface ProductQuery {
  page: number; // 页码 （第 1 页、第 2 页...）
  pageSize: number; // 每页条数 （每页装 10 个、20 个还是 50 个商品？）
  keyword?: string; // 搜索关键词
  status?: string; // 商品状态
}

// 3. 分页返回结构 (通用)
export interface PageResult<T> {
  list: T[]; // 商品列表
  total: number; // 总条数
}

// 创建商品用的类型 (DTO:  Data Transfer Object)
// Omit 是 TS 工具类型, 意思是"忽略"某些字段
// 创建时不需要 id 和 createTime, 其他都要
export type ProductCreateDTO = Omit<Product, "id" | "createTime">;
// ProductCreateDTO 其实就是 Product 但是少了 id 和 createTime

//2. 更新商品用的类型
// partial 意思是 '所有字段变成可选' , 因为更新时可能只要该一个字段
export type ProductUpdateDTO = Partial<ProductCreateDTO>;
//  Partial 是将里面的所以属性变成可选 ?? , 就是你可以传也可以不传
