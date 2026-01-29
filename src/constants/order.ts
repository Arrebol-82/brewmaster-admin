import type { OrderStaus } from "@/types/order";

interface StatusConfig {
  type: "success" | "info" | "warning" | "danger" | "primary" | "";
  label: string;
}

export const ORDER_STATUS_MAP: Record<OrderStaus, StatusConfig> = {
  pending: { type: "info", label: "待支付" },
  paid: { type: "primary", label: "已支付" },
  shipped: { type: "warning", label: "已发货" },
  completed: { type: "success", label: "已完成" },
  cancelled: { type: "danger", label: "已取消" },
};