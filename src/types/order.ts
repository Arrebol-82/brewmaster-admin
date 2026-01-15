export type OrderStaus =
  | "pending"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled";

export interface Order {
  id: number;
  order: string; //订单号 (例如: '20261001001')
  totalAmount: number; // 总金额 (单位: 分)
  status: OrderStaus; // 订单状态
  createTime: string; // 订单创建时间
}

// 查询参数
export interface OrderQuery {
  page: number; // 页码 （第 1 页、第 2 页...）
  pageSize: number; // 每页条数
  status?: OrderStaus | ""; // 订单状态
  keyword?: string; // 搜索关键词
}

// 商品明细
export interface OrderItem {
  id: number;
  name: string; // 商品名称
  price: number; // 商品价格
  count: number; // 商品数量
}

// 订单日志
export interface OrderLog {
  id: number;
  action: string; // 操作类型
  operator: string; // admin
  createTime: string; // 操作时间
}

// 订单详情
export interface OrderDetail extends Order {
  items: OrderItem[];
  logs: OrderLog[];
}
