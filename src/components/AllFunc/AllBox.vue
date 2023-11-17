<script lang="ts" setup>
import ShortCut from "@/components/AllFunc/Box/ShortCut.vue";
import { setStore, siteStore } from "@/stores";
import { storeToRefs } from "pinia";
import Add from "@/components/LinkPanel/Category/Add.vue";

const { links, categories } = storeToRefs(siteStore())

const addCategoryModalShow = ref(false)
const closable = computed(() => {
  return categories.value.length > 1
})
const addable = computed(() => {
  return {
    disabled: categories.value.length >= 10
  }
})

const { selectedCategory } = storeToRefs(siteStore())

const handleAdd = () => {
  addCategoryModalShow.value = true
}
const { $dialog, $message } = window
const handleClose = (category) => {
  $dialog.warning({
    title: '警告',
    content: '你确定删除该分组？（将会删除所有链接）',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      siteStore().deleteCategory(category).then(() => {
        $message.success('删除成功')
      }).catch((error) => {
        $message.error('删除失败：' + error.message)
      })
    },
  })
}

</script>

<template>
  <div>
    <Add v-model="addCategoryModalShow" />
    <n-tabs :addable="addable" :closable="closable" class="all-box" type="card" size="large"
      justify-content="space-evenly" animated v-model:value="selectedCategory" @close="handleClose" @add="handleAdd">
      <n-tab-pane v-for="l in links" :key="l.category" :name="l.category" :tab="l.category" v-if="categories.length">
        <ShortCut :key="l.category" :list="l.links" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>


