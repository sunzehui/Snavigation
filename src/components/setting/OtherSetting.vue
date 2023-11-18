<script lang="ts" setup>
import { setStore } from '@/stores';
import { downloadJSON } from '@/utils/file';

const recoverRef = ref(null);

const set = setStore();

const { $dialog, $message } = window
// 站点重置
const resetSite = () => {
  $dialog.warning({
    title: "站点重置",
    content: "确认重置站点为默认状态？你的全部数据以及自定义设置都将丢失！",
    positiveText: "重置",
    negativeText: "取消",
    onPositiveClick: () => {
      localStorage.clear();
      $message.info("站点重置成功，即将刷新");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });
};

// 站点备份
const backupSite = () => {
  try {
    const date = new Date();
    const dateString = date.toISOString().replace(/[:.]/g, "-");
    const fileName = `Snavigation_Backup_${dateString}.json`;
    const jsonData = set.$state; // Assuming `set.$state` is your JSON data
    downloadJSON(jsonData, fileName);
    // 备份完成
    $message.success("站点备份成功");
  } catch (error) {
    console.error("站点备份失败：", error);
    $message.error("站点备份失败");
  }
};

// 站点恢复
const recoverSite = async () => {
  try {
    const fileInput = recoverRef.value;
    if (!fileInput?.files.length) {
      $message.error("请选择要恢复的备份文件");
      return false;
    }
    const file = fileInput.files[0];
    const jsonData = await file.text();
    const data = JSON.parse(jsonData);
    // 恢复数据
    $dialog.warning({
      title: "站点恢复",
      content: "确认使用该恢复文件？你现有的数据以及自定义设置都将被覆盖！",
      positiveText: "恢复",
      negativeText: "取消",
      onPositiveClick: async () => {
        const isSuccess = await set.recoverSiteData(data);
        if (isSuccess) {
          $message.info("站点恢复成功，即将刷新");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          $message.error("站点数据恢复失败，请重试");
        }
      },
      onNegativeClick: () => {
        recoverRef.value.value = null;
      },
    });
  } catch (error) {
    console.error("站点数据恢复失败：", error);
    $message.error("站点数据恢复失败，请重试");
  }
};

</script>

<style lang="scss">
</style>

<template>
  <n-scrollbar class="scrollbar">
    <n-h6 prefix="bar"> 重置 </n-h6>
    <n-card class="set-item">
      <div class="name">
        <span class="title">站点重置</span>
        <span class="tip">若站点显示异常或出现问题时可尝试此操作</span>
      </div>
      <n-button strong secondary @click="resetSite"> 重置 </n-button>
    </n-card>
    <n-h6 prefix="bar"> 备份 </n-h6>
    <n-card class="set-item">
      <div class="name">
        <span class="title">站点备份</span>
        <span class="tip">将站点配置及个性化内容进行备份</span>
      </div>
      <n-button strong secondary @click="backupSite"> 备份 </n-button>
    </n-card>
    <n-h6 prefix="bar"> 恢复 </n-h6>
    <n-card class="set-item">
      <div class="name">
        <span class="title">数据恢复</span>
        <span class="tip">将备份的站点内容进行恢复</span>
      </div>
      <input ref="recoverRef" type="file" style="display: none" accept=".json" @change="recoverSite" />
      <n-button strong secondary @click="recoverRef?.click()">
        恢复
      </n-button>
    </n-card>
  </n-scrollbar>
</template>
