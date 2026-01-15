<template>
  <div class="product-list">
    <!-- 1. 顶部操作区 (保留了你的搜索和筛选!) -->
    <el-card class="box-card">
      <div class="header-actions">
        <!-- 左侧：搜索和筛选 -->
        <div class="filter-container">
          <!-- 关键词搜索 -->
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入关键词"
            clearable
            style="width: 200px; margin-right: 10px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>

          <!-- 状态筛选 -->
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px; margin-right: 10px"
            @change="handleSearch"
          >
            <!-- 你的状态选项 -->
            <el-option label="全部" value="" />
            <el-option label="在售" value="on_sale" />
            <el-option label="售罄" value="sold_out" />
          </el-select>
        </div>
        <!-- 右侧：新增按钮 (保留权限控制) -->
        <!-- 注意: 如果你之前用了 v-if='authStore.has....' 保留 -->
        <el-button
          v-if="authStore.hasPerm('product:create')"
          type="primary"
          @click="handleCreate"
        >
          <el-icon style="margin-right: 5px"><Plus /></el-icon>
          新增商品
        </el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中..."
        :data="tableData"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column label="价格" width="120">
          <template #default="scope">
            ¥{{ (scope.row.price / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <!-- 状态显示逻辑 -->
            <el-tag
              :type="scope.row.status === 'on_sale' ? 'success' : 'danger'"
            >
              {{ scope.row.status === "on_sale" ? "在售" : "售罄" }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              v-if="authStore.hasPerm('product:edit')"
              size="small"
              type="primary"
              link
              @click="handleEdit(scope.row)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <!-- 删除按钮 (保留权限控制) -->
            <el-button
              v-if="authStore.hasPerm('product:delete')"
              size="small"
              type="danger"
              link
              @click="handleDelete(scope.row)"
            >
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 3. 分页区域 (保留你的分页逻辑) -->
      <div
        class="pagination-container"
        style="margin-top: 20px; display: flex; justify-content: flex-end"
      >
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 15, 20]"
          @size-change="handleSearch"
          @current-change="loadData"
        />
      </div>
    </el-card>
    <!-- 4. 融合核心: 弹窗组件  -->
    <ProductFormDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :current-id="currentRow?.id"
      :initial-data="currentRow"
      @success="loadData"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Plus, Edit, Delete } from "@element-plus/icons-vue";
// 引入API 和 类型
import { getProductList, deleteProduct } from "@/api/products";
import type { Product } from "@/types/product";
//引入day3 写的组件
import ProductFormDialog from "./components/ProductFormDialog.vue";
// 如果你有 authStore 可以保留
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
import { useTable } from "@/composables/useTable";

const {
  loading,
  tableData,
  total,
  queryParams,
  loadData,
  handleSearch,
  handlePageChange,
} = useTable(getProductList);

// 2. 弹窗控制 (新增和编辑)
const dialogVisible = ref(false);
const dialogMode = ref<"create" | "edit">("create");
const currentRow = ref<Product | undefined>(undefined);

// 点击新增
const handleCreate = () => {
  dialogMode.value = "create";
  currentRow.value = undefined;
  dialogVisible.value = true;
};

// 点击编辑
const handleEdit = (row: Product) => {
  dialogMode.value = "edit";
  currentRow.value = row;
  dialogVisible.value = true;
};

// 删除逻辑 (day5)
const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品 ${row.name} 吗?`, "删了就没咯", {
      confirmButtonText: "确定咯",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteProduct(row.id);
    ElMessage.success("删除成功");

    // 细节优化: 如果当前页只有一条数据且不是第一页 , 删完后自动往前一页查询
    if (tableData.value.length === 1 && queryParams.page > 1) {
      queryParams.page--;
    }
    loadData();
  } catch (error) {
    console.error(error);
    // 取消删除
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.filter-container {
  display: flex;
  align-items: center;
}
</style>
