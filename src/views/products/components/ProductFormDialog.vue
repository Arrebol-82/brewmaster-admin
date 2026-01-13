<template>
  <!-- 
    v-model="visible": 控制弹窗显示隐藏
    title: 动态标题，根据 mode 变成 "新增商品" 或 "编辑商品"
    width: 调整为 500px 宽度适中
    @close: 关掉时自动重置表单，防止下次打开还有旧数据
  -->
  <!-- el-dialog 是用于弹窗的组件，可以控制弹窗显示隐藏，根据 mode 变成 "新增商品" 或 "编辑商品" -->
  <el-dialog
    v-model="visible"
    :title="mode === 'create' ? '✨ 新增商品' : '✏️ 编辑商品'"
    width="500px"
    @close="handleClose"
  >
    <!-- 表单区域 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <!-- 1. 商品名称 -->
      <el-form-item label="商品名称" prop="name">
        <!-- 里面的prop是用于校验和重置的 , 让 el-form 知道去哪里找到要动的元素 -->
        <el-input v-model="form.name" placeholder="请输入商品名称" />
      </el-form-item>

      <!-- 2. 价格 (注意：API 定义通常是分，但在表单里我们让用户填，传给后端前不用手动乘100，假设输入就是分，或者看你业务逻辑) -->
      <!-- 这里假设直接输入 分 (例如输入 3000 代表 30.00元)，后续如果需要元转分，可以在 api 层面做 -->
      <el-form-item label="价格(分)" prop="price">
        <el-input-number
          v-model="form.price"
          :min="0"
          :step="100"
          style="width: 100%"
        />
        <!-- :min="0" 表示输入框里面的数 , 最小不能小于 0 -->
        <!-- :step="100" 表示每次改变时，步长为 100 -->
      </el-form-item>

      <!-- 3. 库存 -->
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
      </el-form-item>

      <!-- 4. 状态 -->
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          style="width: 100%"
        >
          <el-option label="上架 (On Sale)" value="on_sale" />
          <el-option label="售罄 (Sold Out)" value="sold_out" />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <!-- #footer 是在底部添加元素，可以是按钮，也可以是其他元素 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
// 确保这两个 API 在 src/api/products.ts 里已经 export 了
import { createProduct, updateProduct } from "@/api/products";
// 确保这个类型在 src/types/product.ts 里定义了 (去掉了 description)
import type { ProductCreateDTO } from "@/types/product";

// 1. 定义父组件传进来的 Props
const props = defineProps<{
  modelValue: boolean; // 控制显示隐藏
  mode: "create" | "edit"; // 模式
  // create 新增，edit 编辑
  currentId?: number; // 编辑时的 ID
  initialData?: any; // 编辑时的初始数据
}>();

// 2. 定义向父组件发送的事件
const emit = defineEmits(["update:modelValue", "success"]);
// 其实就是注册两个自定义事件, 然后用emit来触发 , 让父组件知道

// 3. 双向绑定 visible
const visible = computed({
  get: () => props.modelValue,
  //拿到值后设置值
  set: (val) => emit("update:modelValue", val),
  // emit发给父组件事件 , 告诉他关闭显示
});

const formRef = ref<FormInstance>();
const loading = ref(false);

// 4. 表单数据 (严格匹配 ProductCreateDTO)
const form = reactive<ProductCreateDTO>({
  name: "",
  price: 0,
  stock: 0,
  status: "on_sale",
});

// 5. 校验规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  //  required 是否必填
  price: [
    { required: true, message: "请输入价格", trigger: "blur" },
    { type: "number", min: 0, message: "价格不能为负数", trigger: "blur" },
  ],
  stock: [
    { required: true, message: "请输入库存", trigger: "blur" },
    { type: "number", min: 0, message: "库存不能为负数", trigger: "blur" },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

// 6. 监听打开，处理数据回填或重置
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.mode === "edit" && props.initialData) {
        // 编辑模式：回填数据
        // 注意：API 返回的数据里可能有 createTime，但 form 里不需要，
        // Object.assign 会把多余的属性也拷进去，但这通常不影响提交（axios发请求时可以只发需要的）
        // 为了严谨，你也可以手动赋值
        form.name = props.initialData.name;
        form.price = props.initialData.price;
        form.stock = props.initialData.stock;
        form.status = props.initialData.status;
      } else {
        // 新增模式：重置
        resetForm();
      }
    }
  }
);

const resetForm = () => {
  if (!formRef.value) {
    // 手动重置值
    form.name = "";
    form.price = 0;
    form.stock = 0;
    form.status = "on_sale";
  } else {
    // 移除校验结果并重置为初始值
    formRef.value.resetFields();
    // resetFields 可以把上次的校验样式清除
    // resetFields 可能会把数据重置为 reactive 定义时的初始值，
    // 但为了保险，建议确保数据也是干净的
    form.name = "";
    form.price = 0;
    form.stock = 0;
    form.status = "on_sale";
    // 上面之所以他重置数据 , 就是 resetFields会记住第一次渲染的数据 , 如果用户是通过点击编辑被导向新增的话 , 那就会出问题了
  }
};

const handleClose = () => {
  resetForm();
};

// 7. 提交逻辑
const handleSubmit = async () => {
  if (!formRef.value) return;

  // validate 是用来校验表单的，如果校验通过，就会返回 true ，否则返回 false , 而valid接收validate的返回值
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        if (props.mode === "create") {
          // 调用新增 API
          // 传参 , 发请求
          await createProduct(form);
          // 成功后提示
          ElMessage.success("新增成功");
        } else if (props.mode === "edit" && props.currentId) {
          // 调用编辑 API
          // 传参 , 发请求
          await updateProduct(props.currentId, form);
          ElMessage.success("修改成功");
        }
        // 关闭弹窗
        visible.value = false;
        emit("success"); // 通知父组件刷新列表
      } catch (error) {
        console.error(error);
      } finally {
        // 不论成功与否都要关闭加载动画
        loading.value = false;
      }
    }
  });
};
</script>
