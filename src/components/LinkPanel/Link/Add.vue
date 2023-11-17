<script lang="ts" setup>
import { siteStore } from '@/stores';
import { useVModel } from '@vueuse/core';
import { NForm } from 'naive-ui';
import identifyInput from "@/utils/identifyInput";

const props = defineProps<{
  show: boolean
  value: any
  isEdit: boolean
}>()
const emit = defineEmits(['update:show', 'update:value'])
const isModalShow = useVModel(props, 'show', emit, {
  defaultValue: false
})
const linkFormPayload = useVModel(props, 'value', emit, {
  defaultValue: {}
})
const isModalEdit = computed(() => props.isEdit)
const shortcutData = computed(() => siteStore().activeLinks)
const { $message, $dialog } = window
const addShortcutFormRef = ref<typeof NForm | null>(null)
const addShortcutRules = {
  name: {
    required: true,
    message: "请输入名称",
    trigger: ["input", "blur"],
  },
  url: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error("请输入站点链接");
      } else if (identifyInput(value) !== "url") {
        return new Error("请检查是否为正确的网址");
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
};
// 关闭弹窗
const addShortcutClose = () => {
  isModalShow.value = false;
  linkFormPayload.value = {
    name: "",
    url: "",
  };
};
const checkDuplicate = () => {
  // 是否重复
  const isDuplicate = shortcutData.value?.some(
    (item) =>
      item.name === linkFormPayload.value.name ||
      item.url === linkFormPayload.value.url
  );
  return isDuplicate
}
// 添加或编辑链接
const addShortcut = async () => {
  if (checkDuplicate()) {
    $message.error("新增名称或链接与已有链接重复");
    return false
  }
  await siteStore().addLink({
    name: linkFormPayload.value.name,
    url: linkFormPayload.value.url,
  });
  window.$message.success("链接添加成功");
  addShortcutClose();
  return true;
}

const editShortcut = () => {
  const index = shortcutData.value.findIndex(
    (item) => item.id === linkFormPayload.value.id
  );
  if (index === -1) {
    window.$message.error("链接中不存在该项，请重试");
    return false;
  }
  if (checkDuplicate()) {
    $message.error("编辑名称或链接与已有链接重复");
    return false
  }
  shortcutData.value[index].name = linkFormPayload.value.name;
  shortcutData.value[index].url = linkFormPayload.value.url;
  window.$message.success("链接编辑成功");
  addShortcutClose();
  return true;
}

const addOrEditShortcuts = () => {
  addShortcutFormRef.value?.validate((errors) => {
    if (errors) {
      $message.error("请检查您的输入");
      return false;
    }
    // 新增链接
    if (!isModalEdit.value) {
      return addShortcut()
    } else {
      // 编辑链接
      return editShortcut()
    }
  });
};
</script>
<template>
  <n-modal preset="card" v-model:show="isModalShow" :title="`${isModalEdit ? '编辑' : '添加'}链接`" :bordered="false"
    @mask-click="addShortcutClose">
    <n-form ref="addShortcutFormRef" :rules="addShortcutRules" :model="linkFormPayload" :label-width="80">
      <n-form-item label="链接名称" path="name">
        <n-input clearable show-count maxlength="14" v-model:value="linkFormPayload.name" placeholder="请输入链接名称" />
      </n-form-item>
      <n-form-item label="站点链接" path="url">
        <n-input clearable v-model:value="linkFormPayload.url" placeholder="请输入站点链接" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="addShortcutClose"> 取消 </n-button>
        <n-button strong secondary @click="addOrEditShortcuts">
          {{ isModalEdit ? "编辑" : "添加" }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
