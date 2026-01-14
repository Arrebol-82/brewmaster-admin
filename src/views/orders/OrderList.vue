<template>
  <div class="product-list-container">
    <!-- 搜索栏 (Card 布局) -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams" @submit.prevent>
        <!-- :inline 表示水平排列  :model 表示关了某个数据-->
        <el-form-item label="商品名称">
          <!-- clear 一件清空按钮 @clear 和 clear 是相辅相成的-->
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入关键词"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <!-- 状态下拉框 -->
          <el-select
            v-model="queryParams.status"
            style="width: 150px"
            clearable
            @change="handleSearch"
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">🔍 搜索</el-button>
          <el-button @click="resetSearch">🔄 重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 2. 表格区域 -->
    <el-card class="table-card">
      <!-- 头部操作区 -->
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
          <!-- 昨天的权限按钮 -->
          <el-button v-if="authStore.hasPerm('order:create')" type="primary">
            ➕ 新增商品
          </el-button>
        </div>
      </template>

      <!-- 核心表格 v-loading 加载状态 -->
      <!-- border 就是嘉盛边框和线 -->
      <el-table
        v-loading="loading"
        elemnt-loading-text="加载中..."
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="orderNo" label="商品名称" width="150" />
        <el-table-column prop="totalAmount" label="总金额" width="150" />
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <!-- 这里的 type 逻辑可以写在标签里，也可以写个函数 -->
            <el-tag :type="getStatusType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">🖊️ 编辑</el-button>
            <el-button
              v-if="authStore.hasPerm('order:delete')"
              link
              type="danger"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-area">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[2, 6, 14]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
        <!-- total 显示总数 -->
        <!-- total 共... sizes 10条一页 prev 显示 pager：显示数字页码 1, 2, 3...。 next：显示“下一页”按钮 >。jumper：显示“前往第几页”的输入框。 -->
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { getOrderList } from "@/api/orders";
import type { Order, OrderQuery } from "@/types/order";

const authStore = useAuthStore();

// 状态定义
const loading = ref(false);
const tableData = ref<Order[]>([]);
const total = ref(0);

// 查询参数 (响应式对象)
const queryParams = reactive<OrderQuery>({
  page: 1,
  pageSize: 10,
  keyword: "",
  status: "",
});

//2. 状态选项 (给下拉框用的)
const statusOptions = [
  { label: "全部", value: "" },
  { label: "待支付", value: "pending" },
  { label: "已支付", value: "paid" },
  { label: "已发货", value: "shipped" },
  { label: "已完成", value: "completed" },
  { label: "已取消", value: "cancelled" },
];

// 状态字典：把英文转中文
// 整体流程就是 创建键值对对像 , 在用属性访问符[]动态查询
const formatStatus = (status: string) => {
  // Record 其实就是key_value类型
  const map: Record<string, string> = {
    pending: "待支付",
    paid: "已支付",
    shipped: "已发货",
    completed: "已完成",
    cancelled: "已取消",
  };
  return map[status] || status;
  // 这里面的属性访问符[] 只能用于键值对 ,  但是他的搜索速率是遍历和判断的好几倍 而且机构还清晰
  // [] 里面的值是动态的 , 并不是写死的
};

// 颜色字典：不同状态给不同颜色
// 跟上面同理
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: "warning", // 黄色
    paid: "primary", // 蓝色
    shipped: "success", // 绿色
    completed: "info", // 灰色
    cancelled: "danger", // 红色
  };
  return map[status] || "info";
};

//核心逻辑: 加载数据
// 这里要搞清楚一个概念 , ELement-plus会把我计算需要多少个页面显示 , 所以我们只要传每页显示多少 , 总共多少即可
const loadData = async () => {
  loading.value = true;
  try {
    // 调用 API
    const res = await getOrderList(queryParams);
    // 根据你的axios封装 , 这里可能直接是 data , 或者是 res.data
    // 假设 request.ts 里已经解包了 code/message
    tableData.value = res.data.list; // 一页显示多少杯咖啡
    total.value = res.data.total; // 总数
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  queryParams.page = 1; // 搜索时重置回第一页
  loadData();
};

// 重置
const resetSearch = () => {
  queryParams.status = "";
  handleSearch();
};

// 页面挂载时加载
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.product-list-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-area {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
