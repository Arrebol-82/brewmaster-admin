export interface Order {
  id: number;
  order: string; //订单号 (例如: '20261001001')
  totalAmount: number; // 总金额 (单位: 分)
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled"; //
  createTime: string; // 订单创建时间
}

export interface OrderQuery {
  page: number; // 页码 （第 1 页、第 2 页...）
  pageSize: number; // 每页条数
  status?: string; // 订单状态
  keyword?: string; // 搜索关键词
}
