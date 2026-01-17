<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getOrderDetail } from "@/api/orders";
import type { OrderDetail } from "@/types/order";
import { ElMessage } from "element-plus";

const route = useRoute();
// route是拿到路由参数的对象
const router = useRouter();
// router是导航器，可以在路由变化时触发函数

const loading = ref(false);
const order = ref<OrderDetail | null>(null);

// 1. 获取路由参数中的 ID
const orderId = Number(route.params.id);
// params是拿到URL里面的参数的对象

// 2. 加载数据
const loadData = async () => {
  if (!orderId) return;
  loading.value = true;
  try {
    const res = await getOrderDetail(orderId);
    console.log(res);
// console.log('订单项数量：', res.data.items.length);
    order.value = (res as any).data;
  } catch (error) {
    console.error(error);
    ElMessage.error("获取订单详情失败");
  } finally {
    loading.value = false;
  }
};

const orderStatusMap: Record<string, { type: string; label: string }> = {
  pending: { type: "warning", label: "待支付" },
  paid: { type: "success", label: "已支付" },
  shipped: { type: "info", label: "已发货" },
  completed: { type: "info", label: "已完成" },
  cancelled: { type: "danger", label: "已取消" },
};

// 这样的好处就是不用每次调用函数都创建一次 orderStatusMap对象
const getStatusConfig = (status: string) => {
  return orderStatusMap[status] || { type: "info", label: "未知状态" };
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="app-container" v-loading="loading">
    <!-- 顶部导航 -->
    <el-page-header @back="router.back()" title="返回列表"> 
      <template #content>
        <span class="text-large font-600 mr-3">订单详情</span>
        <!-- 判断是否有订单 -->
        <span v-if="order" style="margin-left: 10px; font-size: 14px; color: #909399;">
          {{ order.order }}
        </span>
      </template>

      <!-- 右侧操作区  -->
      <template #extra>
        <el-tag v-if="order" :type="getStatusConfig(order.status).type" size="large">
            {{ getStatusConfig(order.status).label }}
        </el-tag>
      </template>
    </el-page-header>

    <el-divider />

    <div v-if="order">
      <!-- 核心信息区 -->
       <el-descriptions title="基础信息" :column="3" border>
          <el-descriptions-item label="订单号">{{ order.order }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ order.createTime }}</el-descriptions-item> 
          <el-descriptions-item label="支付金额">
            <span style="color: #f56c6c; font-weight: bold;">
              ¥ {{ (order.totalAmount / 100 ).toFixed(2) }} 
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="买家ID">{{ order.id }} (模拟)</el-descriptions-item>
          <el-descriptions-item label="支付方式">微信支付</el-descriptions-item> 
          <el-descriptions-item label="备注">无</el-descriptions-item>
       </el-descriptions>

          <!-- 🔵 3. 商品清单 (Table) -->
      <div class="section-title">商品清单</div>
      <el-table :data="order.items" border style="width: 100%">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column label="单价" width="120">
          <template #default="{ row }">¥ {{ (row.price / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="count" label="数量" width="100" align="center" />
        <el-table-column label="小计" width="120" align="right">
          <template #default="{ row }">
            ¥ {{ ((row.price * row.count) / 100).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>

            <!-- 🟣 4. 状态日志 (Timeline) -->
      <div class="section-title">操作日志</div>
       <div class="log-area">
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in order.logs"
            :key="index"
            :timestamp="log.createTime"
            :type="index === order.logs.length - 1 ? 'primary' : ''" 
          >
            <h4>{{ log.action }}</h4>
            <p>操作人: {{ log.operator }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
       <!-- 空状态 (防止 id 不存在) -->
    <el-empty v-else-if="!loading" description="未找到订单信息" />
  </div>
</template>




<style scoped>
.app-container {
  padding: 20px;
  background-color: #fff;
  min-height: 80vh;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 25px 0 15px;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}
.log-area {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
