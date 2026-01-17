<template>
  <div class="app-container" style="padding: 20px">
    <!-- 1. 顶部筛选与操作栏 (保持原有布局结构) -->
    <el-card shadow="never" class="1-wrapper">
      <!-- Flex 布局保持不变 -->
      <div
        class="filter-container"
        style="display: flex; gap: 10px; margin-bottom: 20px"
      >
        <!-- 搜索框：改了 placeholder 和绑定变量 -->
        <el-input
          v-model="queryParams.keyword"
          placeholder="搜索订单号"
          clearable
          style="width: 200px"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <!-- 状态下拉框：改了 options -->
        <el-select
          v-model="queryParams.status"
          placeholder="订单状态"
          clearable
          style="width: 150px"
          @change="handleSearch"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 按钮组：保留搜索和重置 -->
        <el-button type="primary" @click="handleSearch">
          <el-icon style="margin-right: 5px"><Search /></el-icon>
          搜索
        </el-button>

        <el-button @click="handleReset">
          <el-icon style="margin-right: 5px"><Refresh /></el-icon>
          重置
        </el-button>

        <!-- 💡 订单通常不需要“新增”按钮，所以我这里去掉了，如果你想保留可以加回来 -->
      </div>
    </el-card>

    <!-- 2. 表格区域 (列定义做了适配) -->
    <el-card shadow="never" style="margin-top: 20px">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中..."
        :data="tableData"
        border
        style="width: 100%"
      >
        <!-- ID 列 -->
        <el-table-column prop="id" label="ID" width="80" align="center" />

        <!-- 订单号：对应后端字段 order -->
        <el-table-column prop="order" label="订单号" min-width="180" />

        <!-- 总金额：后端是分，前端除以100 -->
        <el-table-column label="总金额" width="140">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">
              ¥ {{ (row.totalAmount / 100).toFixed(2) }}
            </span>
          </template>
        </el-table-column>

        <!-- 状态列：使用 Tag 美化 -->
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type" effect="plain">
              {{ statusMap[row.status]?.label || "未知状态" }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 下单时间 -->
        <el-table-column prop="createTime" label="下单时间" width="180" />

        <!-- 操作列：改为查看详情 -->
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleDetail(row.id)"
            >
              <el-icon style="margin-right: 4px"><View /></el-icon>
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 3. 分页区域 (完全复用) -->
      <div style="margin-top: 20px; display: flex; justify-content: flex-end">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { Search, Refresh, View } from "@element-plus/icons-vue";
// ✅ 核心 1: 引入 API 和 Hook
import { getOrderList } from "@/api/orders";
import { useTable } from "@/composables/useTable";

const router = useRouter();

// ✅ 核心 2: 使用 useTable 接管数据流
// 这里的泛型 <Order> 非常关键，它让 tableData 知道自己装的是订单数据
const {
  loading,
  tableData,
  total,
  queryParams,
  loadData,
  handleSearch,
  handlePageChange,
} = useTable(getOrderList);

// 状态字典 (下拉框用)
const statusOptions = [
  { label: "待支付", value: "pending" },
  { label: "已支付", value: "paid" },
  { label: "已发货", value: "shipped" },
  { label: "已完成", value: "completed" },
  { label: "已取消", value: "cancelled" },
];

// 状态显示逻辑 (Tag颜色)
const statusMap: Record<
  string,
  { type: "success" | "info" | "warning" | "danger" | ""; label: string }
> = {
  pending: { type: "warning", label: "待支付" },
  paid: { type: "success", label: "已支付" },
  shipped: { type: "info", label: "已发货" },
  completed: { type: "info", label: "已完成" },
  cancelled: { type: "danger", label: "已取消" },
};
// 重置按钮逻辑 (复用 ProductList 的思路)
const handleReset = () => {
  queryParams.keyword = "";
  queryParams.status = "";
  handleSearch();
};

// 跳转详情页 (订单独有逻辑)
const handleDetail = (id: number) => {
  router.push(`/orders/${id}`);
};

onMounted(() => {
  // 初始化数据
  loadData();
});
</script>
