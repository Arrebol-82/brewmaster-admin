import { ref, reactive } from "vue";
import type { PageResult } from "@/types/product";

// T 列表项的类型 (比如 Product)
export function useTable<T>(
  apiFunc: (params: any) => Promise<{ data: PageResult<T> }>
) {
  const loading = ref(false);
  const tableData = ref<T[]>([]);
  const total = ref(0);

  // 通用的查询参数
  const queryParams = reactive({
    page: 1,
    pageSize: 10,
    keyword: "",
    status: "",
  });

  //核心加载函数
  const loadData = async () => {
    loading.value = true;
    try {
      // 调用传入 API 函数
      const res = await apiFunc(queryParams);
      // 这里的 .data.list 取决与你的 API 响应结构 , 按需调整
      tableData.value = res.data.list;
      total.value = res.data.total;
    } catch (error) {
      console.error("加载失败", error);
    } finally {
      loading.value = false;
    }
  };

  // 搜索 (重置页码)
  const handleSearch = () => {
    queryParams.page = 1;
    loadData();
  };

  // 分页改变 (Element Plus 的分页器)
  const handlePageChange = () => {
    loadData();
  };

  return {
    loading,
    tableData,
    total,
    queryParams,
    loadData,
    handleSearch,
    handlePageChange,
  };
}
