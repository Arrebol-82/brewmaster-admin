<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getOrderDetail , updateOrderStatus} from "@/api/orders";
import type { OrderDetail , OrderStaus } from "@/types/order";
import { ElMessage, ElMessageBox } from "element-plus";
import { ORDER_STATUS_MAP } from "@/constants/order";
import { useAuthStore  } from "@/stores/auth";


const route = useRoute();
// route是拿到路由参数的对象
const router = useRouter();
// router是导航器，可以在路由变化时触发函数

const loading = ref(false);
const order = ref<OrderDetail | null>(null);

const authStore = useAuthStore();

// 1. 获取路由参数中的 ID
const orderId = Number(route.params.id);
// params是拿到URL里面的参数的对象

// 2. 加载数据
const loadData = async () => {
  if (!orderId) return;
  loading.value = true;
  try {
    const res = await getOrderDetail(orderId);
// console.log('订单项数量：', res.data.items.length);
    order.value = (res as any).data;
  } catch (error) {
    console.error(error);
    ElMessage.error("获取订单详情失败");
  } finally {
    loading.value = false;
  }
};


// 这样的好处就是不用每次调用函数都创建一次 orderStatusMap对象
const getStatusConfig = (status: OrderStaus) => {
  return ORDER_STATUS_MAP[status] || { type: "info", label: "未知状态" };
};

// 更新订单状态
const handleStatusChange = async (newStatus: OrderStaus) => {
  if (!order.value) return;

  // 二次确认
  const confirmMap: Record<string, string> = {
    paid: "确认用户已经付款了吗?",
    shipped: "确认商品已经发货了吗?",
    completed: "确认订单已经完成了吗?",
    cancelled: "确认订单已经取消了吗? 此操作不可恢复!",
  }

  try {
    await ElMessageBox.confirm(confirmMap[newStatus] || '确认执行操作?', '提示', {
      type: newStatus === 'cancelled' ? 'warning' : 'info',
    })

    if (!order.value?.id) return;
    await updateOrderStatus(order.value.id, newStatus)
    ElMessage.success('操作成功')

    loadData()

  } catch (error) { 
    if (error !== 'cancel') console.error(error)
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="app-container" v-loading="loading">
    
    <el-page-header @back="router.back()">
      <template #content>
        <span class="text-large font-600 mr-3"> 订单详情：{{ order?.order }} </span>
      </template>

      <template #extra>
        <div class="header-actions" style="display: flex; align-items: center;">
          
          <el-tag 
            v-if="order" 
            :type="getStatusConfig(order.status).type" 
            size="large" 
            effect="dark"
            style="margin-right: 15px;"
          >
            {{ getStatusConfig(order.status).label }}
          </el-tag>

          <div v-if="order" class="action-buttons">
            <el-button v-if="order.status === 'pending'" type="primary" plain @click="handleStatusChange('paid')">模拟支付</el-button>
            <el-button v-if="order.status === 'paid'" type="success" plain @click="handleStatusChange('shipped')">发货</el-button>
            <el-button v-if="order.status === 'shipped'" type="warning" plain @click="handleStatusChange('completed')">确认送达</el-button>
            <el-button v-if="!['completed', 'cancelled'].includes(order.status) && authStore.isAdmin" type="danger" @click="handleStatusChange('cancelled')">取消订单</el-button>
          </div>
        </div>
      </template>
    </el-page-header>

    <div style="margin: 20px 0;">
      </div>

    <div class="section-title">操作日志</div>
    
    <div class="log-scroll-container">
      <div class="log-area">
        <el-empty 
          v-if="!order?.logs || order.logs.length === 0" 
          description="暂无操作记录" 
          :image-size="60" 
        />


        <el-timeline v-else>
           <!-- :hollow="index === order.logs.length - 1" 如果是最会一个数据 , 那么就是实心的 -->
          <el-timeline-item
            v-for="(log, index) in order.logs"
            :key="log.id"
            :timestamp="log.createTime"
            :type="index === order.logs.length - 1 ? 'primary' : ''"
            :hollow="index === order.logs.length - 1"
          >
            <h4 style="margin: 0 0 5px 0;">{{ log.action }}</h4>
            <p style="margin: 0; color: #909399; font-size: 13px;">
              操作人: {{ log.operator }}
            </p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

  </div>
</template>




<style scoped>
.app-container {
  padding: 20px;
  background-color: #fff;
  min-height: 80vh;
}

.log-area {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.section-title {
  margin: 20px 0;
  font-weight: bold;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

/* 💡 滚动条的核心样式 */
.log-scroll-container {
  max-height: auto;      /* 固定高度，超过这个高度就出滚动条 */
  overflow-y: auto;       /* 纵向溢出自动显示滚动条 */
  border: 1px solid #ebeef5;
  }
</style>
