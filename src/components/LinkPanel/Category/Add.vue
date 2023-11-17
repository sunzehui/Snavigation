<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { siteStore } from '@/stores';
import { FormRules, NForm } from 'naive-ui';

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const addCategoryFormRef = ref<typeof NForm | null>(null)
const addCategoryModalShow = useVModel(props, 'modelValue', emit, {
  defaultValue: false
})
const addCategoryClose = () => {
  emit('update:modelValue', false)
}
const categoryPayload = ref({
  name: "",
});
const addCategoryRules: FormRules = {
  name: {
    required: true,
    message: "请输入名称",
    validator(rule, value) {
      // 禁止包含html特殊字符
      if (!value) {
        return new Error("请输入名称");
      } else if (!/^[^<>]*$/.test(value)) {
        return new Error("禁止包含html特殊字符")
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
};
const { $message } = window
async function addCategory() {
  addCategoryFormRef.value.validate(async errors => {
    if (errors) {
      $message.error("请检查您的输入")
      return false
    }
    // 禁止重名
    const categories = siteStore().categories
    if (categories.find(c => c === categoryPayload.value.name)) {
      $message.error("该分组已存在")
      return false
    }

    const isAdded = await siteStore().addCategory(categoryPayload.value.name)
    if (isAdded) {
      window.$message.success('添加成功！')
      addCategoryClose()
      categoryPayload.value = {
        name: "",
      }
    }
  })

}
</script>

<template>
  <!-- 添加捷径 -->
  <n-modal preset="card" v-model:show="addCategoryModalShow" :title="`${'添加'}分组`" :bordered="false"
    @mask-click="addCategoryClose">
    <n-form ref="addCategoryFormRef" :rules="addCategoryRules" :model="categoryPayload" :label-width="80">
      <n-form-item label="分组名称" path="name">
        <n-input clearable show-count maxlength="14" v-model:value="categoryPayload.name" placeholder="请输入分组名称" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="addCategoryClose"> 取消 </n-button>
        <n-button strong primary @click="addCategory"> 确定 </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

