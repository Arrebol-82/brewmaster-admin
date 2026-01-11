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
          <span>商品列表</span>
          <!-- 昨天的权限按钮 -->
          <el-button v-if="authStore.hasPerm('product:create')" type="primary">
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
        <el-table-column prop="name" label="商品名称" width="150" />
        <el-table-column>
          <template #default="{ row }">
            <!-- 格式化价格: 分转元 -->
            ¥ {{ (row.price / 100).toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'on_sale' ? 'success' : 'danger'">
              {{ row.status === "on_sale" ? "在售" : "售罄" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" widht="180" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">🖊️ 编辑</el-button>
            <el-button
              v-if="authStore.hasPerm('product:delete')"
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
import { getProductList } from "@/api/products";
import type { Product, ProductQuery } from "@/types/product";

const authStore = useAuthStore();

// 状态定义
const loading = ref(false);
const tableData = ref<Product[]>([]);
const total = ref(0);

// 查询参数 (响应式对象)
const queryParams = reactive<ProductQuery>({
  page: 1,
  pageSize: 10,
  keyword: "",
});

//核心逻辑: 加载数据
// 这里要搞清楚一个概念 , ELement-plus会把我计算需要多少个页面显示 , 所以我们只要传每页显示多少 , 总共多少即可
const loadData = async () => {
  loading.value = true;
  try {
    // 调用 API
    const res = await getProductList(queryParams);
    // 根据你的axios封装 , 这里可能直接是 data , 或者是 res.data
    // 假设 request.ts 里已经解包了 code/message
    tableData.value = res.data.list; // 一页显示多少杯咖啡
    total.value = res.data.total; // 总数
  } catch (error) {
    console.log(error);
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
  queryParams.keyword = "";
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
